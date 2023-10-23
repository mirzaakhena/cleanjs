import { Usecases } from "../../framework/core.js";
import { rewardCreate } from "./usecase_reward_create.js";
import { rewardGetAll } from "./usecase_reward_getall.js";
import { rewardRedeem } from "./usecase_reward_redeem.js";
import { strukApproval } from "./usecase_struk_approval.js";
import { strukGetAll } from "./usecase_struk_getall.js";
import { strukUpload } from "./usecase_struk_upload.js";
import { userCreate } from "./usecase_user_create.js";
import { userGetAll } from "./usecase_user_getall.js";
import { userRewardApproval } from "./usecase_user_reward_approval.js";
import { userRewardGetAll } from "./usecase_user_reward_getall.js";
import { userChangeStatus } from "./usecase_user_change_status.js";
import { userPointGetAll } from "./usecase_user_point_getall.js";

export const usecases: Usecases = {
  //
  rewardCreate,
  rewardGetAll,
  userRewardApproval,
  rewardRedeem,
  strukUpload,
  strukGetAll,
  strukApproval,
  userRewardGetAll,
  userGetAll,
  userCreate,
  userChangeStatus,
  userPointGetAll,
};
