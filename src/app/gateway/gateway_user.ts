import { Column, Entity, PrimaryColumn } from "typeorm";
import { User as IUser, UserID, UserStatus } from "../model/user.js";

@Entity()
export class User extends IUser {
  //

  @PrimaryColumn({ type: "varchar", length: 20 })
  declare id: UserID;

  @Column({ type: "timestamp", nullable: true })
  declare createdDate?: Date;

  @Column({ type: "varchar", length: 50 })
  declare name: string;

  @Column({ type: "int" })
  declare totalPoints: number;

  @Column({ type: "varchar", length: 10 })
  declare status?: UserStatus;
  //
}
