import { Usecases } from "../../framework/core.js";
import { receiptApproval } from "./usecase_receipt_approval.js";
import { receiptGetAll } from "./usecase_receipt_getall.js";
import { receiptUpload } from "./usecase_receipt_upload.js";
import { rewardCreate } from "./usecase_reward_create.js";
import { rewardGetAll } from "./usecase_reward_getall.js";
import { rewardRedeem } from "./usecase_reward_redeem.js";
import { userChangeStatus } from "./usecase_user_change_status.js";
import { userCreate } from "./usecase_user_create.js";
import { userGetAll } from "./usecase_user_getall.js";
import { userPointGetAll } from "./usecase_user_point_getall.js";
import { userRewardApproval } from "./usecase_user_reward_approval.js";
import { userRewardGetAll } from "./usecase_user_reward_getall.js";

export const usecaseCollections: Usecases = {
  //
  rewardCreate,
  rewardGetAll,
  userRewardApproval,
  rewardRedeem,
  receiptUpload,
  receiptGetAll,
  receiptApproval,
  userRewardGetAll,
  userGetAll,
  userCreate,
  userChangeStatus,
  userPointGetAll,
};
