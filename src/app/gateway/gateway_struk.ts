import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { ApprovalStatus } from "../model/approval.js";
import { Image } from "../model/image.js";
import { User as IUser } from "../model/user.js";
import { Struk as IStruk } from "../model/struk.js";
import { User } from "./gateway_user.js";

@Entity()
export class Struk extends IStruk {
  //

  @PrimaryColumn({ type: "varchar", length: 20 })
  declare id: string;

  @Column({ type: "varchar", length: 10 })
  declare status: ApprovalStatus;

  @Column({ type: "timestamp", nullable: true })
  declare approvalDate: Date;

  @Column({ type: "timestamp" })
  declare createdDate: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: "userID" })
  declare user: IUser;

  @Column({ type: "varchar", length: 30 })
  declare billNumber: string;

  @Column({ type: "int" })
  declare totalTransaksi: number;

  @Column({ type: "jsonb", nullable: true })
  declare screenshot: Image;

  //
}
