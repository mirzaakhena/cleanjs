import { HTTPData } from "../../framework/data_http.js";
import { controllerReward } from "./controller_reward.js";
import { controllerReceipt } from "./controller_receipt.js";
import { controllerUser } from "./controller_user.js";
import { controllerUserPoint } from "./controller_user_point.js";
import { controllerUserReward } from "./controller_user_reward.js";

export const controllerCollection: HTTPData[] = [
  //
  ...controllerUser,
  ...controllerReward,
  ...controllerReceipt,
  ...controllerUserReward,
  ...controllerUserPoint,
];
