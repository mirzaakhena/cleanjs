import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { ApprovalStatus } from "../model/approval.js";
import { Reward as IReward } from "../model/reward.js";
import { User as IUser } from "../model/user.js";
import { Reward } from "./gateway_reward.js";
import { User } from "./gateway_user.js";

@Entity()
export class UserReward {
  //
  @PrimaryColumn({ type: "varchar", length: 20 })
  id: string;

  @Column({ type: "varchar", length: 10 })
  status: ApprovalStatus;

  @Column({ type: "timestamp", nullable: true })
  approvalDate: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: "userID" })
  user: IUser;

  @Column({ type: "timestamp", nullable: true })
  createdDate: Date;

  @ManyToOne(() => Reward)
  @JoinColumn({ name: "rewardID" })
  reward: IReward;
}
