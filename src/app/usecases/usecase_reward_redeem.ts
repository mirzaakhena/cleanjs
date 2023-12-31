import { Usecase } from "../../framework/core.js";
import { FindOneEntity, SaveEntity } from "../../framework/repo.js";
import { Reward, RewardID } from "../model/reward.js";
import { User, UserID } from "../model/user.js";
import { UserReward, UserRewardID } from "../model/user_reward.js";

type Outport = {
  findOneUser: FindOneEntity<User, UserID>;
  findOneReward: FindOneEntity<Reward, RewardID>;
  saveUserReward: SaveEntity<UserReward>;
};

export type InportRequest = {
  rewardID: RewardID;
  newUserRewardID: UserRewardID;
  now: Date;
  userID: UserID;
};

export type InportResponse = {
  id: RewardID;
};

export const rewardRedeem: Usecase<Outport, InportRequest, InportResponse> = {
  gatewayNames: [
    //
    "findOneUser",
    "findOneReward",
    "saveUserReward",
  ],
  execute: (o) => {
    //

    return async (ctx, req) => {
      //

      const user = await o.findOneUser(ctx, req.userID);
      if (!user) {
        throw new Error("User not found");
      }

      if (user.status === "NON_ACTIVE") {
        throw new Error("User is non active");
      }

      // cari reward
      const objR = await o.findOneReward(ctx, req.rewardID);
      if (!objR) {
        throw new Error();
      }

      // tambahkan user reward
      {
        const objUP = new UserReward();
        {
          //
          objUP.id = req.newUserRewardID;
          objUP.user = user;
          objUP.createdDate = req.now;
          objUP.reward = objR;
          objUP.status = "PENDING";
          objUP.approvalDate = null;
        }
        await o.saveUserReward(ctx, objUP);
      }

      return { id: objR.id };
    };
  },
};
