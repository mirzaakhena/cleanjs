import { Column, DataSource, Entity, EntityManager, FindOptionsSelect, FindOptionsWhere, ILike, In, PrimaryColumn } from "typeorm";
import { RequestType, Context } from "../../framework/core.js";
import {
  DeleteAllRecording,
  DeleteSomeRecording,
  DeleteSomeRecordingPlaylist,
  FindAllRecording,
  FindAllRecordingFilter,
  FindAllRecordingPlaylist,
  FindAllRecordingPlaylistFilter,
  DataRecording as IDataRecording,
  DataRecordingPlaylist as IDataRecordingPlaylist,
  SaveRecording,
  SaveRecordingPlaylist,
  UpdateRecording,
} from "./recording.js";
import { RecordFunction } from "./recording.js";

@Entity()
export class DataRecording implements IDataRecording {
  //
  @PrimaryColumn({ type: "text" })
  id: string = "";

  @Column({ type: "timestamp" })
  date: Date = new Date();

  @Column({ type: "text" })
  funcName: string = "";

  @Column({ type: "text", nullable: true })
  description: string = "";

  @Column({ type: "text" })
  requestType: RequestType = "command";

  @Column({ type: "jsonb", nullable: true })
  input?: any;

  @Column({ type: "jsonb", nullable: true })
  output?: any;

  @Column({ type: "jsonb", nullable: true })
  error?: any;

  @Column({ type: "jsonb", nullable: true })
  functions?: RecordFunction[];

  @Column({ type: "integer" })
  duration?: number;

  //
}

@Entity()
export class DataRecordingPlaylist implements IDataRecordingPlaylist {
  @PrimaryColumn({ type: "text" })
  id: string = "";

  @Column({ type: "text", nullable: true })
  description: string = "";

  @Column({ type: "jsonb" })
  recordIds: string[] = [];
}

export const ImplSaveRecordingToDB = (ds: DataSource): SaveRecording => {
  //
  return async (ctx: Context, obj: IDataRecording): Promise<void> => {
    //
    await ds.getRepository(DataRecording).save(obj);
  };

  //
};

export const ImplDeleteRecording = (ds: DataSource): DeleteSomeRecording => {
  //
  return async (ctx: Context, ids: string[]): Promise<void> => {
    //
    await ds.getRepository(DataRecording).delete(ids);
  };

  //
};

export const ImplDeleteAllRecording = (ds: DataSource): DeleteAllRecording => {
  //
  return async (ctx: Context): Promise<void> => {
    //

    try {
      // Start a transaction
      await ds.transaction(async (em: EntityManager) => {
        const query = `TRUNCATE TABLE "data_recording" RESTART IDENTITY CASCADE`;
        await em.query(query);
      });

      console.log("All recording data has been deleted.");
    } catch (error) {
      console.error("Error occurred while deleting recording data:", error);
    }
  };

  //
};

export const ImplFindAllRecording = (ds: DataSource): FindAllRecording => {
  //
  return async (ctx: Context, filter: FindAllRecordingFilter): Promise<[IDataRecording[], number]> => {
    //
    let where: FindOptionsWhere<DataRecording> = {};

    if (filter.ids && filter.ids.length > 0) where.id = In(filter.ids);
    if (filter.requestType) where.requestType = filter.requestType;
    if (filter.funcNameLike) where.funcName = ILike(`%${filter.funcNameLike}%`);
    if (filter.descriptionLike) where.description = ILike(`%${filter.descriptionLike}%`);
    // if (filter.dateStart) where.dateStart = filter.dateStart;
    // if (filter.dateEnd) where.dateEnd = filter.dateEnd;

    const size = filter.size || 20;
    const page = (filter.page && filter.page < 1 ? 1 : filter.page) || 1;

    const select: FindOptionsSelect<DataRecording> = {
      id: true,
      date: true,
      funcName: true,
      description: true,
      requestType: true,
      error: true,
      duration: true,
    };

    if (filter.complete) {
      select.input = {};
      select.output = {};
      select.functions = {};
    }

    const result = await ds.getRepository(DataRecording).findAndCount({
      where,
      select,
      take: size,
      skip: (page - 1) * size,
      order: {
        date: "DESC",
      },
    });

    return result;
  };

  //
};

export const ImplUpdateRecording = (ds: DataSource): UpdateRecording => {
  //
  return async (ctx: Context, req: { id: string; description: string; input: any }): Promise<void> => {
    //

    if (req.description === undefined) {
      return;
    }

    let updatedRow: any = {};

    if (req.description || req.description === "") updatedRow.description = req.description;
    if (req.input || req.input === "") updatedRow.input = req.input;

    await ds.getRepository(DataRecording).update(req.id, updatedRow);
  };

  //
};

export const ImplSaveRecordingPlaylist = (ds: DataSource): SaveRecordingPlaylist => {
  //
  return async (ctx: Context, obj: IDataRecordingPlaylist): Promise<void> => {
    //
    await ds.getRepository(DataRecordingPlaylist).save(obj);
  };

  //
};

export const ImplDeleteRecordingPlaylist = (ds: DataSource): DeleteSomeRecordingPlaylist => {
  //
  return async (ctx: Context, id: string): Promise<void> => {
    //
    await ds.getRepository(DataRecordingPlaylist).delete(id);
  };

  //
};

export const ImplFindAllRecordingPlaylist = (ds: DataSource): FindAllRecordingPlaylist => {
  //
  return async (ctx: Context, filter: FindAllRecordingPlaylistFilter): Promise<[IDataRecordingPlaylist[], number]> => {
    //
    let where: FindOptionsWhere<DataRecordingPlaylist> = {};

    if (filter.id) where.id = filter.id;
    if (filter.descriptionLike) where.description = ILike(`%${filter.descriptionLike}%`);

    const size = filter.size || 20;
    const page = (filter.page && filter.page < 1 ? 1 : filter.page) || 1;

    const result = await ds.getRepository(DataRecordingPlaylist).findAndCount({
      where,
      take: size,
      skip: (page - 1) * size,
    });

    return result;
  };
};
