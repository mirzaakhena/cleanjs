import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { User as IUser } from "../model/user.js";
import { User } from "./gateway_user.js";

@Entity()
export class UserPoint {
  //
  @PrimaryColumn({ type: "varchar", length: 20 })
  id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: "userID" })
  user: IUser;

  @Column({ type: "int" })
  point: number;

  @Column({ type: "timestamp", nullable: true })
  createdDate: Date;
}
