import express from "express";
import { Context, FunctionType, Inport, Middleware, RequestType, UsecaseWithGatewayInstance } from "../../framework/core.js";
import {
  ImplDeleteAllRecording,
  ImplDeleteRecording,
  ImplDeleteRecordingPlaylist,
  ImplFindAllRecording,
  ImplFindAllRecordingPlaylist,
  ImplSaveRecordingPlaylist,
  ImplSaveRecordingToDB,
  ImplUpdateRecording,
} from "./recording_typeorm.js";
import { handleRecording } from "./recording_express.js";
import { DataSource } from "typeorm";

const FOLDER_NAME = "recording";
const RECORDING_FIELD = "recording";

type RecordingState = {
  enabled: boolean;
  // command: boolean;
  // query: boolean;
  saveRecording: SaveRecording | null;
};

export const recordingState: RecordingState = {
  enabled: false,
  // command: false,
  // query: false,
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

export interface DataRecordingPlaylist {
  id: string;
  description: string;
  recordIds: string[];
}

export type SaveRecordingPlaylist = (ctx: Context, obj: DataRecordingPlaylist) => Promise<void>;

export type DeleteSomeRecordingPlaylist = (ctx: Context, id: string) => Promise<void>;

export type FindAllRecordingPlaylistFilter = {
  id?: string;
  page?: number;
  size?: number;
  descriptionLike?: string;
};

export type FindAllRecordingPlaylist = (ctx: Context, filter: FindAllRecordingPlaylistFilter) => Promise<[DataRecordingPlaylist[], number]>;

export type RecordFunction = {
  funcName?: string;
  description?: string;
  requestType: RequestType;
  input?: any;
  output?: any;
  error?: any;
  functions?: RecordFunction[];
  duration?: number; // TODO: count duration
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

const prepareRecorder = (ctx: Context) => {
  if (!recordingState.enabled) {
    return;
  }

  if (!recordingState.saveRecording) {
    return;
  }

  ctx.data[RECORDING_FIELD] = {
    functions: [],
    description: "meoong",
  };
};

const recordValue = (ctx: Context, funcType: FunctionType, payload: RecordAndStorePayload) => {
  if (funcType === "controller") {
    recordController(ctx, payload);
    return;
  }
  if (funcType === "gateway") {
    recordGateway(ctx, payload);
    return;
  }
};

const recordGateway = (ctx: Context, payload: RecordAndStorePayload) => {
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
    duration: payload.duration,
  });

  return payload.output;
};

const recordController = async (ctx: Context, payload: RecordAndStorePayload) => {
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
  recording.duration = payload.duration;

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

export const setDescriptionRecording = (ctx: Context, description: string) => {
  if (!ctx.data[RECORDING_FIELD]) {
    return;
  }

  ctx.data[RECORDING_FIELD].description = description;
};

export const getDescriptionFromContext = (ctx: Context) => {
  if (!ctx.data[RECORDING_FIELD]) {
    return undefined;
  }

  return ctx.data[RECORDING_FIELD].description;
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

      const start = Date.now();

      //
      if (funcType === "controller") {
        prepareRecorder(ctx);
      }

      try {
        //

        const result = await inport(ctx, input);

        recordValue(ctx, funcType, {
          requestType,
          funcName: name,
          input,
          output: result,
          description: getDescriptionFromContext(ctx),
          duration: Date.now() - start,
        });

        return result;

        //
      } catch (error: any) {
        //

        recordValue(ctx, funcType, {
          requestType,
          funcName: name,
          input,
          error: error.message,
          description: getDescriptionFromContext(ctx),
          duration: Date.now() - start,
        });

        throw error;
      }
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
    deleteSomeRecordingPlaylist: ImplDeleteRecordingPlaylist(ds),
    saveRecordingPlaylist: ImplSaveRecordingPlaylist(ds),
    findAllRecordingPlaylist: ImplFindAllRecordingPlaylist(ds),
    replayableUsecases,
    usecaseWithGatewayInstance,
  });

  return router;
};

// // recording_ui
// {
//   const __filename = fileURLToPath(import.meta.url);
//   const __dirname = path.dirname(__filename);
//   const distPath = path.join(__dirname, "plugin/recording/dist");
//   isDevMode && app.use("/recording", recordingInit(recordingRouter, ds, usecaseWithGatewayInstance));
//   app.get("/recording/ui", (req, res) => res.sendFile(path.join(distPath, "index.html")));
//   app.use("/assets", express.static(path.join(distPath, "assets")));
// }
