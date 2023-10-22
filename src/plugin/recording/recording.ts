import express from "express";
import { Context, Inport, Middleware, RequestType, UsecaseWithGatewayInstance } from "../../framework/core.js";
import {
  ImplDeleteAllRecording,
  ImplDeleteRecording,
  ImplDeleteRecordingJourney,
  ImplFindAllRecording,
  ImplFindAllRecordingJourney,
  ImplSaveRecordingJourney,
  ImplSaveRecordingToDB,
  ImplUpdateRecording,
} from "./recording_typeorm.js";
import { handleRecording } from "./recording_express.js";
import { DataSource } from "typeorm";

const FOLDER_NAME = "recording";
const RECORDING_FIELD = "recording";

type RecordingState = {
  enabled: boolean;
  saveRecording: SaveRecording | null;
};

export const recordingState: RecordingState = {
  enabled: false,
  saveRecording: null, //ImplSaveRecordingToFile(FOLDER_NAME),
};

export type ReplayableUsecase = {
  name: string;
  inport: Inport;
};

export interface DataRecording extends RecordFunction {
  date: Date;
  id: string;
}

export type SaveRecording = (ctx: Context, obj: DataRecording) => Promise<void>;

export type UpdateRecording = (ctx: Context, req: { id: string; description: string; input: any }) => Promise<void>;

export type DeleteSomeRecording = (ctx: Context, traceIds: string[]) => Promise<void>;

export type DeleteAllRecording = (ctx: Context) => Promise<void>;

export type FindAllRecordingFilter = {
  page?: number;
  size?: number;
  ids?: string[];
  requestType?: RequestType;
  dateStart?: Date;
  dateEnd?: Date;
  descriptionLike?: string;
  funcNameLike?: string;
  isSuccess?: boolean;
  complete?: boolean;
};

export type FindAllRecording = (ctx: Context, filter: FindAllRecordingFilter) => Promise<[DataRecording[], number]>;

export interface DataRecordingJourney {
  id: string;
  description: string;
  recordIds: string[];
}

export type SaveRecordingJourney = (ctx: Context, obj: DataRecordingJourney) => Promise<void>;

export type DeleteSomeRecordingJourney = (ctx: Context, id: string) => Promise<void>;

export type FindAllRecordingJourneyFilter = {
  id?: string;
  page?: number;
  size?: number;
  descriptionLike?: string;
};

export type FindAllRecordingJourney = (ctx: Context, filter: FindAllRecordingJourneyFilter) => Promise<[DataRecordingJourney[], number]>;

export type RecordFunction = {
  funcName?: string;
  description?: string;
  requestType: RequestType;
  input?: any;
  output?: any;
  error?: any;
  functions?: RecordFunction[];
};

export type RecordAndStorePayload = Omit<RecordFunction, "functions">;

export const areDataObjectsEqual = (dataObj1: any, dataObj2: any) => {
  return JSON.stringify(dataObj1) === JSON.stringify(dataObj2);
};

const getExpectedOutput = (f: RecordFunction, funcName: string, input: any) => {
  const result = f.functions?.find((x) => x.funcName === funcName && areDataObjectsEqual(x.input, input));
  if (!result) {
    throw new Error(`func ${funcName} does not have an input like ${JSON.stringify(input)}`);
  }
  return result.output;
};

export const prepareRecorder = (ctx: Context) => {
  if (!recordingState.enabled) {
    return;
  }

  if (!recordingState.saveRecording) {
    console.log("saveRecording not initialized");
    return;
  }

  ctx.data[RECORDING_FIELD] = {
    functions: [],
  };
};

export const recordGateway = (ctx: Context, payload: RecordAndStorePayload) => {
  //

  if (!ctx.data[RECORDING_FIELD]) {
    return payload.output;
  }

  const recording = ctx.data[RECORDING_FIELD] as RecordFunction;
  if (recording.functions?.some((x) => areDataObjectsEqual(x.input, payload.input))) {
    return payload.output;
  }

  recording.functions?.push({
    funcName: payload.funcName,
    requestType: payload.requestType,
    input: payload.input,
    output: payload.output,
    description: payload.description,
    error: payload.error,
  });

  return payload.output;
};

export const recordController = async (ctx: Context, payload: RecordAndStorePayload) => {
  //

  if (!ctx.data[RECORDING_FIELD]) {
    return payload.output;
  }
  const recording = ctx.data[RECORDING_FIELD] as RecordFunction;

  recording.funcName = payload.funcName;
  recording.requestType = payload.requestType;
  recording.description = payload.description;
  recording.error = payload.error;
  recording.input = payload.input;
  recording.output = payload.output;

  await recordingState.saveRecording!(ctx, {
    ...recording,
    id: ctx.traceId,
    date: ctx.date,
  });

  return payload.output;
};

export const createBaseFunc = <REQUEST, RESPONSE>(rf: RecordFunction, actionName: string) => {
  return async (ctx: Context, request: REQUEST): Promise<RESPONSE> => {
    const result = getExpectedOutput(rf, actionName, request);
    return result;
  };
};

export const recordingMiddleware: () => Middleware = () => {
  //

  return (funcType, requestType, name, inport) => {
    //

    return async (ctx, input) => {
      //

      if (!recordingState.enabled) {
        return await inport(ctx, input);
      }

      if (funcType === "controller" && requestType === "command") {
        //
        prepareRecorder(ctx);
        try {
          const result = await inport(ctx, input);

          recordController(ctx, {
            requestType,
            funcName: name,
            input,
            output: result,
            description: "", // TODO fill this later
          });

          return result;

          //
        } catch (error: any) {
          //

          recordController(ctx, {
            requestType,
            funcName: name,
            input,
            error,
            description: "", // TODO fill this later
          });

          throw error;
        }
      }

      if (funcType === "gateway") {
        try {
          const result = await inport(ctx, input);

          recordGateway(ctx, {
            requestType,
            funcName: name,
            input,
            output: result,
            description: "", // TODO fill this later
          });

          return result;

          //
        } catch (error: any) {
          //

          recordGateway(ctx, {
            requestType,
            funcName: name,
            input,
            error,
            description: "", // TODO fill this later
          });

          throw error;
        }
      }

      return await inport(ctx, input);
    };
  };
};

export const recordingInit = (router: express.Router, ds: DataSource, usecaseWithGatewayInstance: UsecaseWithGatewayInstance) => {
  //

  const implSaveRecording = ImplSaveRecordingToDB(ds);

  recordingState.saveRecording = implSaveRecording;

  const replayableUsecases: ReplayableUsecase[] = [];

  for (const name in usecaseWithGatewayInstance) {
    const { requestType, inport } = usecaseWithGatewayInstance[name];
    if (requestType === "command") {
      replayableUsecases.push({ inport, name });
    }
  }

  handleRecording(router, {
    saveRecording: implSaveRecording,
    updateRecording: ImplUpdateRecording(ds),
    findAllRecording: ImplFindAllRecording(ds),
    deleteSomeRecording: ImplDeleteRecording(ds),
    deleteAllRecording: ImplDeleteAllRecording(ds),
    deleteSomeRecordingJourney: ImplDeleteRecordingJourney(ds),
    saveRecordingJourney: ImplSaveRecordingJourney(ds),
    findAllRecordingJourney: ImplFindAllRecordingJourney(ds),
    replayableUsecases,
    usecaseWithGatewayInstance,
  });

  return router;
};
