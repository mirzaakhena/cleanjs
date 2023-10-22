// findManyUserReward: { requestType: "query", gateway: null },
// findOneUserReward: { requestType: "query", gateway: null },
// saveUserReward: { requestType: "command", gateway: null },

import { Column, DataSource, Entity, FindOptionsWhere, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { getManager } from "../../framework/gateway_typeorm.js";
import { FindManyEntity, FindOneEntity } from "../../framework/repo.js";

import { Admin as IAdmin } from "../model/admin.js";
import { ApprovalStatus } from "../model/approval.js";
import { Reward as IReward } from "../model/reward.js";
import { User as IUser } from "../model/user.js";
import { FindManyUserRewardFilter, UserReward as IUserReward, UserRewardID } from "../model/user_reward.js";
import { Admin } from "./gateway_admin.js";
import { Reward } from "./gateway_reward.js";
import { User } from "./gateway_user.js";

@Entity()
export class UserReward extends IUserReward {
  //
  @PrimaryColumn({ type: "varchar", length: 20 })
  declare id: string;

  @Column({ type: "varchar", length: 10 })
  declare status: ApprovalStatus;

  @ManyToOne(() => Admin)
  @JoinColumn({ name: "approvalByAdminID" })
  declare approvalBy: IAdmin;

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

// export const saveUserReward = (ds: DataSource): SaveEntity<UserReward, UserRewardID> => {
//   return async (ctx, req) => {
//     await getManager(ctx, ds).getRepository(UserReward).save(req);
//     return req.id;
//   };
// };

// export const findManyUserReward = (ds: DataSource): FindManyEntity<UserReward, FindManyUserRewardFilter> => {
//   //

//   return async (ctx, filter) => {
//     //

//     let where: FindOptionsWhere<UserReward> = {};

//     //

//     const size = filter.size || 20;
//     const page = (filter.page && filter.page < 1 ? 1 : filter.page) || 1;

//     const result = await getManager(ctx, ds) //
//       .getRepository(UserReward)
//       .findAndCount({
//         take: size,
//         skip: (page - 1) * size,
//         where,
//         relations: {
//           reward: true,
//           user: true,
//         },
//         order: {},
//       });

//     return result;
//   };
// };

// export const findOneUserReward = (ds: DataSource): FindOneEntity<UserReward, UserRewardID> => {
//   return async (ctx, id) => await getManager(ctx, ds).getRepository(UserReward).findOneBy({ id });
// };
