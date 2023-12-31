import express from "express";
import { Outport, RequestType, UsecaseWithGatewayInstance } from "../../framework/core.js";
import { extractArrayString, extractBoolean, extractNumber, generateID } from "../../framework/helper.js";
import {
  DataRecordingPlaylist,
  DataRecordingPlaylistItem,
  DeleteAllRecording,
  DeleteSomeRecording,
  DeleteSomeRecordingPlaylist,
  FindAllRecording,
  FindAllRecordingPlaylist,
  ReplayableUsecase,
  SaveRecording,
  SaveRecordingPlaylist,
  UpdateRecording,
  areDataObjectsEqual,
  createBaseFunc,
  recordingState,
} from "./recording.js";

const getContext = (data: any) => {
  return {
    data,
    date: new Date(),
    traceId: generateID(),
  };
};

export const handleRecording = (
  router: express.IRouter,
  repos: {
    //
    saveRecording: SaveRecording;
    updateRecording: UpdateRecording;
    findAllRecording: FindAllRecording;
    deleteAllRecording: DeleteAllRecording;
    deleteSomeRecording: DeleteSomeRecording;
    findAllRecordingPlaylist: FindAllRecordingPlaylist;
    saveRecordingPlaylist: SaveRecordingPlaylist;
    deleteSomeRecordingPlaylist: DeleteSomeRecordingPlaylist;

    replayableUsecases: ReplayableUsecase[];
    usecaseWithGatewayInstance: UsecaseWithGatewayInstance;
  }
) => {
  //

  router.get("/status", async (req, res) => {
    //
    res.json({ enabled: recordingState.enabled });
    //
  });

  router.post("/status", async (req, res) => {
    //
    recordingState.enabled = req.body.enabled as boolean;

    res.json({ message: `switch to recording ${recordingState.enabled}` });
    //
  });

  router.get("/record", async (req, res) => {
    //

    const ctx = getContext("");

    const [items, count] = await repos.findAllRecording(ctx, {
      ids: extractArrayString(req.query.ids),
      descriptionLike: req.query.descriptionLike as string,
      funcNameLike: req.query.funcNameLike as string,
      requestType: req.query.requestType as RequestType,
      isSuccess: extractBoolean(req.query.isSuccess),
      page: extractNumber(req.query.page),
      size: extractNumber(req.query.size),
    });

    res.json({ enabled: recordingState.enabled, items, count });
  });

  router.get("/record/:recordId", async (req, res) => {
    //

    const ctx = getContext("");

    const [items] = await repos.findAllRecording(ctx, {
      ids: [req.params.recordId],
      complete: true,
    });

    res.json(items[0]);

    //
  });

  router.get("/record/:recordId/download", async (req, res) => {
    //

    const ctx = getContext("");

    const [items, count] = await repos.findAllRecording(ctx, {
      ids: [req.params.recordId],
      complete: true,
    });

    if (count === 0) {
      res.status(400).json({ message: `no data found in ${req.params.recordId}` });
      return;
    }

    const item = items[0];

    const jsonString = JSON.stringify(item, null, 2);
    const filename = `${item.requestType}-${item.funcName}-${item.id}${item.description ? `-${item.description}` : ""}.json`;

    const buffer = Buffer.from(jsonString, "utf-8");
    res.setHeader("Content-disposition", `attachment; filename=${filename}`);
    res.setHeader("Content-type", "application/json");

    res.send(buffer);
    //
  });

  router.delete("/record", async (req, res) => {
    //

    const ctx = getContext("");

    await repos.deleteAllRecording(ctx);
    res.json({ message: "all recording is deleted" });
  });

  router.delete("/record/:recordId", async (req, res) => {
    //

    const recordId = req.params.recordId;
    const ctx = getContext("");

    try {
      await repos.deleteSomeRecording(ctx, [recordId]);
      res.json({ message: `recording ${recordId} is deleted` });
    } catch (err) {
      res.status(400).json({ message: (err as Error).message });
    }
  });

  router.post("/record/:recordId/clone", async (req, res) => {
    //

    const recordId = req.params.recordId;
    const description = req.body.description;
    const input = req.body.input ?? undefined;

    const ctx = getContext("");

    try {
      const [recordings] = await repos.findAllRecording(ctx, {
        ids: [recordId],
        complete: true,
      });

      const recordingThatWeWantToClone = recordings.find((recording) => recording.id === recordId);
      if (!recordingThatWeWantToClone) {
        throw new Error(`recording with id  ${recordId} is not found`);
      }

      const newId = generateID();

      if (description === "") {
        throw new Error(`description must not empty`);
      }

      recordingThatWeWantToClone.id = newId;
      recordingThatWeWantToClone.date = new Date();
      recordingThatWeWantToClone.description = description;

      if (input) {
        recordingThatWeWantToClone.input = input;
      }

      await repos.saveRecording(ctx, recordingThatWeWantToClone);

      res.json({
        message: `recording with id ${recordId} already cloned to id ${newId}`,
        recordId: newId,
      });
      //
    } catch (err) {
      res.status(400).json({ message: (err as Error).message });
    }
  });

  router.put("/record/:recordId", async (req, res) => {
    //
    const recordId = req.params.recordId;
    const description = req.body.description;
    const input = req.body.input ?? undefined;
    const ctx = getContext("");

    try {
      const [result, count] = await repos.findAllRecording(ctx, {
        ids: [recordId],
        complete: input !== undefined,
      });

      if (count === 0) {
        throw new Error(`recording with id  ${recordId} is not found`);
      }

      await repos.updateRecording(ctx, {
        id: result[0].id,
        description,
        input,
      });

      res.json({ message: `description recording with id ${recordId} is updated` });
      //
    } catch (err) {
      res.status(400).json({ message: (err as Error).message });
    }
  });

  router.post("/record/:recordId/replay", async (req, res) => {
    //

    const recordId = req.params.recordId;
    const ctx = getContext("");

    try {
      //
      const [recordings, count] = await repos.findAllRecording(ctx, {
        ids: [recordId],
        complete: true,
      });

      if (count === 0) {
        throw new Error(`recording with id  ${recordId} is not found`);
      }

      const recording = recordings[0];

      const usecase = repos.replayableUsecases.find((r) => r.name === recording.funcName);
      if (!usecase) {
        throw new Error(`usecase with name "${recording.funcName}" not found`);
      }

      await usecase.inport(ctx, recording.input);

      res.json({ message: `recording with id ${recordId} is replayed successfuly` });
      //
    } catch (err) {
      //
      res.status(400).json({ message: (err as Error).message });
    }
  });

  router.post("/record/:recordId/test", async (req, res) => {
    //

    const recordId = req.params.recordId;
    const ctx = getContext("");

    try {
      //
      const [recordings, count] = await repos.findAllRecording(ctx, {
        ids: [recordId],
        complete: true,
      });

      if (count === 0) {
        throw new Error(`recording with id  ${recordId} is not found`);
      }

      const recording = recordings[0];

      const usecase = repos.usecaseWithGatewayInstance[recording.funcName as string].usecase;

      let o: Outport = {};

      for (const gatewayName of usecase.gatewayNames) {
        //

        o = { ...o, [gatewayName as string]: createBaseFunc(recording, gatewayName as string) };
      }

      const execute = repos.usecaseWithGatewayInstance[recording.funcName as string].usecase.execute(o);

      try {
        const result = await execute(ctx, recording.input);

        if (!areDataObjectsEqual(recording.output, result)) {
          res.json({ message: `recording with id ${recordId} is not equal`, status: "success", expectation: recording.output, actual: result });
          return;
        }

        res.json({ message: `recording with id ${recordId} is equal`, status: "success" });
      } catch (error: any) {
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>", error);

        if (!areDataObjectsEqual(recording.error, error)) {
          res.json({ message: `recording with id ${recordId} is not equal`, status: "error", expectation: recording.error, actual: error });
          return;
        }

        res.json({ message: `recording with id ${recordId} is equal`, status: "error" });

        return;
      }
    } catch (err) {
      //
      res.status(400).json({ message: (err as Error).message });
    }
  });

  router.post("/playlist", async (req, res) => {
    //
    try {
      const ctx = getContext("");
      const name = req.body.name;
      const recordIds = req.body.recordIds as string[];

      if (name === "") {
        throw new Error(`name must not empty`);
      }

      const [result] = await repos.findAllRecording(ctx, {
        ids: recordIds,
        size: 500,
      });

      for (const ra of recordIds) {
        if (!result.find((rb) => rb.id === ra)) {
          throw new Error(`recording with id ${ra} is not found`);
        }
      }

      const id = generateID();
      await repos.saveRecordingPlaylist(ctx, {
        id,
        name,
        records: result.map((r) => {
          return {
            description: r.description,
            funcName: r.funcName,
            id: r.id,
            requestType: r.requestType,
          } as DataRecordingPlaylistItem;
        }),
      });

      res.json({ message: `playlist with id ${id} has been created`, id });
    } catch (err) {
      res.status(400).json({ message: (err as Error).message });
    }
  });

  router.get("/playlist", async (req, res) => {
    //

    const ctx = getContext("");
    const [items, count] = await repos.findAllRecordingPlaylist(ctx, {
      page: extractNumber(req.query.page),
      size: extractNumber(req.query.size),
      nameLike: req.query.nameLike as string,
    });

    res.json({ items, count });
  });

  router.get("/playlist/:playlistId", async (req, res) => {
    //

    const [result, count] = await repos.findAllRecordingPlaylist(getContext(""), {
      id: req.params.playlistId,
    });

    if (count === 0) {
      throw new Error(`recording playlist with id  ${req.params.playlistId} is not found`);
    }

    res.json(result[0]);
  });

  router.put("/playlist/:playlistId", async (req, res) => {
    //

    try {
      const ctx = getContext("");

      const playlistId = req.params.playlistId;
      const name = req.body.name;
      const recordIds = req.body.recordIds as string[];

      let [newPlaylists, count] = await repos.findAllRecordingPlaylist(ctx, {
        id: playlistId,
      });

      if (count === 0) {
        throw new Error(`recording playlist with id  ${playlistId} is not found`);
      }

      if (name === "") {
        throw new Error(`name must not empty`);
      }

      const [result] = await repos.findAllRecording(ctx, {
        ids: recordIds,
      });

      for (const ra of recordIds) {
        if (!result.find((rb) => rb.id === ra)) {
          throw new Error(`recording with id ${ra} is not found`);
        }
      }

      const newPlaylist: DataRecordingPlaylist = {
        ...newPlaylists[0],
        name,
        records: result.map((r) => {
          return {
            description: r.description,
            funcName: r.funcName,
            id: r.id,
            requestType: r.requestType,
          } as DataRecordingPlaylistItem;
        }),
      };

      await repos.saveRecordingPlaylist(ctx, newPlaylist);

      res.json({
        message: `playlist id ${playlistId} has been updated`,
      });
    } catch (err) {
      res.status(400).json({ message: (err as Error).message });
    }
  });

  router.delete("/playlist/:playlistId", async (req, res) => {
    //
    const ctx = getContext("");
    await repos.deleteSomeRecordingPlaylist(ctx, req.params.playlistId);

    res.json({
      message: `playlist id ${req.params.playlistId} has been deleted`,
    });
  });

  router.post("/playlist/:playlistId/replay", async (req, res) => {
    const ctx = getContext("");

    const playlistId = req.params.playlistId;

    try {
      const [playlists, count] = await repos.findAllRecordingPlaylist(ctx, {
        id: playlistId,
      });

      if (count === 0) {
        throw new Error(`recording playlist with id  ${playlistId} is not found`);
      }

      //
      for (const record of playlists[0].records.reverse()) {
        //
        const [recordings, count] = await repos.findAllRecording(ctx, {
          ids: [record.id],
          complete: true,
        });

        if (count === 0) {
          throw new Error(`recording with id ${record} is not found`);
        }

        const recording = recordings[0];

        const usecase = repos.replayableUsecases.find((r) => r.name === recording.funcName);
        if (!usecase) {
          throw new Error(`usecase with name "${recording.funcName}" not found`);
        }

        if (recording.requestType === "query" || recording.error) {
          continue;
        }

        try {
          await usecase.inport(ctx, recording.input);
        } catch (err) {
          throw new Error(`recording id ${recording.id} has error : ${(err as Error).message}`);
        }

        //
      }

      res.json({ message: `playlist ${playlistId} is run successfully` });
    } catch (err) {
      //
      res.status(400).json({ message: (err as Error).message });
    }
  });

  //
};
