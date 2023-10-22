import { Usecase } from "../../framework/core.js";
import { FindOneEntity, SaveEntity } from "../../framework/repo.js";
import { Reward, RewardID } from "../model/reward.js";
import { ApprovalActionStatus } from "../model/approval.js";
import { UserID } from "../model/user.js";
import { UserReward, UserRewardID } from "../model/user_reward.js";

type Outport = {
  findOneReward: FindOneEntity<Reward, RewardID>;
  saveUserReward: SaveEntity<UserReward, UserRewardID>;
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
    "findOneReward",
    "saveUserReward",
  ],
  execute: (o) => {
    //

    return async (ctx, req) => {
      //

      // cari reward
      const objR = await o.findOneReward(ctx, req.rewardID);
      if (!objR) {
        throw new Error();
      }

      // tambahkan user reward
      {
        const objUP: UserReward = new UserReward();
        {
          //
          objUP.id = req.newUserRewardID;
          objUP.user = { id: req.userID };
          objUP.createdDate = req.now;
          objUP.reward = objR;
          objUP.status = "PENDING";
          // objUP.approvalBy = null;
          objUP.approvalDate = null;
        }
        await o.saveUserReward(ctx, objUP);
      }

      return { id: objR.id };
    };
  },
};
