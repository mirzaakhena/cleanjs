import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { ApprovalStatus } from "../model/approval.js";
import { Image } from "../model/image.js";
import { User as IUser } from "../model/user.js";
import { User } from "./gateway_user.js";

@Entity()
export class Struk {
  //

  @PrimaryColumn({ type: "varchar", length: 20 })
  id: string;

  @Column({ type: "varchar", length: 10 })
  status: ApprovalStatus;

  @Column({ type: "timestamp", nullable: true })
  approvalDate: Date;

  @Column({ type: "timestamp" })
  createdDate: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: "userID" })
  user: IUser;

  @Column({ type: "varchar", length: 30 })
  billNumber: string;

  @Column({ type: "int" })
  totalTransaksi: number;

  @Column({ type: "jsonb", nullable: true })
  screenshot: Image;

  //
}
