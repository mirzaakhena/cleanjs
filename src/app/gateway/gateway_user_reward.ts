import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { ApprovalStatusType } from "../model/approval.js";
import { Reward as IReward } from "../model/reward.js";
import { User as IUser } from "../model/user.js";
import { UserReward as IUserReward } from "../model/user_reward.js";
import { Reward } from "./gateway_reward.js";
import { User } from "./gateway_user.js";

@Entity()
export class UserReward extends IUserReward {
  //
  @PrimaryColumn({ type: "varchar", length: 20 })
  declare id: string;

  @Column({ type: "varchar", length: 10 })
  declare status: ApprovalStatusType;

  @Column({ type: "timestamp", nullable: true })
  declare approvalDate: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: "userID" })
  declare user: IUser;

  @Column({ type: "timestamp", nullable: true })
  declare createdDate: Date;

  @ManyToOne(() => Reward)
  @JoinColumn({ name: "rewardID" })
  declare reward: IReward;
}
