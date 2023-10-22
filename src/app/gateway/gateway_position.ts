import { Column, DataSource, Entity, PrimaryColumn } from "typeorm";
import { Context } from "../../framework/core.js";
import { FindDepartment as IFindDepartment, FindPosition as IFindPosition, FindUser as IFindUser } from "../model/_model.js";

@Entity()
export class Position {
  //
  @PrimaryColumn({ type: "varchar", length: 20 })
  id: string = "";

  @Column({ type: "varchar", length: 50 })
  name: string = "";
}

export const FindUser = (ds: DataSource): IFindUser => {
  return async (ctx: Context, data: string): Promise<string> => {
    // console.log("gateway FindUser", data);
    // throw new Error("terjadi exception");
    return "abc";
  };
};

export const FindPosition = (ds: DataSource): IFindPosition => {
  return async (ctx: Context, data: boolean): Promise<boolean> => {
    // console.log("gateway FindPosition", data);
    return false;
  };
};

export const FindDepartment = (ds: DataSource): IFindDepartment => {
  return async (ctx: Context, data: number): Promise<number> => {
    // console.log("gateway FindDepartment", data);
    return 66;
  };
};
