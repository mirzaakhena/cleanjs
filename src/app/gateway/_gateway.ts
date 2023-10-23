import { DataSource, FindOptionsRelations } from "typeorm";
import { Gateways } from "../../framework/core.js";
import { findManyEntity, findOneEntity, saveEntity } from "../../framework/gateway_typeorm.js";
import { Reward } from "./gateway_reward.js";
import { Struk } from "./gateway_struk.js";
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

  const strukOptions = {
    relations: {
      user: true,
      // approvalBy: true,
    } as FindOptionsRelations<Struk>,
  };

  return {
    //
    findManyReward: { requestType: "query", gateway: findManyEntity(ds, Reward, rewardOptions) },
    findOneReward: { requestType: "query", gateway: findOneEntity(ds, Reward) },
    saveReward: { requestType: "command", gateway: saveEntity(ds, Reward) },

    findManyStruk: { requestType: "query", gateway: findManyEntity(ds, Struk, strukOptions) },
    findOneStruk: { requestType: "query", gateway: findOneEntity(ds, Struk, strukOptions) },
    saveStruk: { requestType: "command", gateway: saveEntity(ds, Struk) },

    findManyUserReward: { requestType: "query", gateway: findManyEntity(ds, UserReward, userRewardOptions) },
    findOneUserReward: { requestType: "query", gateway: findOneEntity(ds, UserReward, userRewardOptions) },
    saveUserReward: { requestType: "command", gateway: saveEntity(ds, UserReward) },

    findManyUser: { requestType: "query", gateway: findManyEntity(ds, User) },
    findOneUser: { requestType: "query", gateway: findOneEntity(ds, User) },
    saveUser: { requestType: "command", gateway: saveEntity(ds, User) },

    saveUserPoint: { requestType: "command", gateway: saveEntity(ds, UserPoint) },
    findManyUserPoint: { requestType: "query", gateway: findManyEntity(ds, UserPoint) },
  };
};
