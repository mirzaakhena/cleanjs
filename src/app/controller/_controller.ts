import { HTTPData } from "../../framework/data_http.js";
import { controllerReward } from "./controller_reward.js";
import { controllerStruk } from "./controller_struk.js";
import { controllerUser } from "./controller_user.js";
import { controllerUserPoint } from "./controller_user_point.js";
import { controllerUserReward } from "./controller_user_reward.js";

export const controllerCollection: HTTPData[] = [
  //
  ...controllerUser,
  ...controllerReward,
  ...controllerStruk,
  ...controllerUserReward,
  ...controllerUserPoint,
];
