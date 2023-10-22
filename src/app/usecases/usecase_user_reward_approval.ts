import { Usecase } from "../../framework/core.js";
import { FindOneEntity, SaveEntity } from "../../framework/repo.js";
import { AdminID } from "../model/admin.js";
import { ApprovalActionStatus, ApprovalStatus } from "../model/approval.js";
import { Reward, RewardID } from "../model/reward.js";
import { User, UserID } from "../model/user.js";
import { UserPoint, UserPointID } from "../model/user_point.js";
import { UserReward, UserRewardID } from "../model/user_reward.js";

type Outport = {
  findOneUserReward: FindOneEntity<UserReward, UserRewardID>;
  saveUserReward: SaveEntity<UserReward, UserRewardID>;
  saveReward: SaveEntity<Reward, RewardID>;
  saveUser: SaveEntity<User, UserID>;
  saveUserPoint: SaveEntity<UserPoint, UserPointID>;
};

export type InportRequest = {
  adminID: AdminID;
  userRewardID: UserRewardID;
  newUserPointID: UserPointID;
  now: Date;
  status: ApprovalActionStatus;
};

export type InportResponse = {
  id: RewardID;
  status: ApprovalStatus;
};

export const userRewardApproval: Usecase<Outport, InportRequest, InportResponse> = {
  gatewayNames: [
    //
    "findOneUserReward",
    "saveUserReward",
    "saveReward",
    "saveUser",
    "saveUserPoint",
  ],
  execute: (o) => {
    //

    return async (ctx, req) => {
      //

      // cari reward
      const objUR = await o.findOneUserReward(ctx, req.userRewardID);
      if (!objUR) {
        throw new Error(`userReward with id ${req.userRewardID} is not found`);
      }

      // update status
      const status = objUR.updateStatus!(req.now, req.adminID, req.status);
      await o.saveUserReward(ctx, objUR);

      // kalau di reject langsung keluar saja
      if (status === "REJECTED") {
        return { id: objUR.id, status };
      }

      // reduce reward stock
      {
        objUR.reward.reduceStock!();
        await o.saveReward(ctx, objUR.reward);
      }

      // kurangi point pada user
      {
        objUR.user.decreasePoint!(objUR.reward.point);
        await o.saveUser(ctx, objUR.user);
      }

      // catat user point yang berkurang
      {
        const objUP: UserPoint = new UserPoint();
        {
          //
          objUP.id = req.newUserPointID;
          objUP.user = objUR.user;
          objUP.createdDate = req.now;
          // tenant: objUS.tenant,
          objUP.point = -objUR.reward.point;
        }
        await o.saveUserPoint(ctx, objUP);
      }

      return { id: objUR.id, status };
    };
  },
};
