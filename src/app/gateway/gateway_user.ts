import { Column, Entity, PrimaryColumn } from "typeorm";
import { User as IUser, UserID } from "../model/user.js";

@Entity()
export class User extends IUser {
  //

  @PrimaryColumn({ type: "varchar", length: 20 })
  declare id: UserID;

  @Column({ type: "varchar", length: 50 })
  declare name: string;

  @Column({ type: "int" })
  declare totalPoints: number;
  //
}
