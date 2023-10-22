import { BaseFindManyFilter, Identifier } from "../../framework/repo.js";
import { AdminID } from "./admin.js";
import { Approval, ApprovalActionStatus, GetApprovalStatus } from "./approval.js";
import { Reward } from "./reward.js";

import { User, UserID } from "./user.js";

// =============================================================================================================================

export type UserRewardID = Identifier;

export class UserReward extends Approval<UserRewardID> {
  user: User;
  reward: Reward; // TODO copy data reward disini
  createdDate: Date;
}

// =============================================================================================================================

export type FindManyUserRewardFilter = BaseFindManyFilter & {
  //
  userID: UserID;
};

// =============================================================================================================================
