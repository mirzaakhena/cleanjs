import { DataSource, FindOptionsRelations } from "typeorm";
import { Gateways } from "../../framework/core.js";
import { findManyEntity, findOneEntity, saveEntity } from "../../framework/gateway_typeorm.js";
import { Reward } from "./gateway_reward.js";
import { Receipt } from "./gateway_receipt.js";
import { User } from "./gateway_user.js";
import { UserPoint } from "./gateway_user_point.js";
import { UserReward } from "./gateway_user_reward.js";

export const gateways = (ds: DataSource): Gateways => {
  //

  const rewardOptions = {
    //
  };

  const userRewardOptions = {
    relations: {
      user: true,
      reward: true,
    } as FindOptionsRelations<UserReward>,
  };

  const receiptOptions = {
    relations: {
      user: true,
    } as FindOptionsRelations<Receipt>,
  };

  return {
    //
    findManyReward: { isInsertOrModify: false, gateway: findManyEntity(ds, Reward) },
    findOneReward: { isInsertOrModify: false, gateway: findOneEntity(ds, Reward) },
    saveReward: { isInsertOrModify: true, gateway: saveEntity(ds, Reward) },

    findManyReceipt: { isInsertOrModify: false, gateway: findManyEntity(ds, Receipt, receiptOptions) },
    findOneReceipt: { isInsertOrModify: false, gateway: findOneEntity(ds, Receipt, receiptOptions) },
    saveReceipt: { isInsertOrModify: true, gateway: saveEntity(ds, Receipt) },

    findManyUserReward: { isInsertOrModify: false, gateway: findManyEntity(ds, UserReward, userRewardOptions) },
    findOneUserReward: { isInsertOrModify: false, gateway: findOneEntity(ds, UserReward, userRewardOptions) },
    saveUserReward: { isInsertOrModify: true, gateway: saveEntity(ds, UserReward) },

    findManyUser: { isInsertOrModify: false, gateway: findManyEntity(ds, User) },
    findOneUser: { isInsertOrModify: false, gateway: findOneEntity(ds, User) },
    saveUser: { isInsertOrModify: true, gateway: saveEntity(ds, User) },

    saveUserPoint: { isInsertOrModify: true, gateway: saveEntity(ds, UserPoint) },
    findManyUserPoint: { isInsertOrModify: false, gateway: findManyEntity(ds, UserPoint) },
  };
};
