import { Column, Entity, PrimaryColumn } from "typeorm";
import { UserID, UserStatus } from "../model/user.js";

@Entity()
export class User {
  //

  @PrimaryColumn({ type: "varchar", length: 20 })
  id: UserID;

  @Column({ type: "varchar", length: 50 })
  name: string;

  @Column({ type: "int" })
  totalPoints: number;

  @Column({ type: "varchar", length: 10 })
  status?: UserStatus;
  //
}
