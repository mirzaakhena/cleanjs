import express from "express";
import { HTTPData, collectSimpleController, simpleController } from "../../framework/controller_express.js";
import { Controller } from "../../framework/core.js";
import { controllerUser } from "./controller_user.js";
import { controllerUserReward } from "./controller_user_reward.js";
import { controllerStruk } from "./controller_struk.js";
import { controllerReward } from "./controller_reward.js";

export const controllerCollection: HTTPData[] = [
  //
  ...controllerUser,
  ...controllerReward,
  ...controllerStruk,
  ...controllerUserReward,
];

export const controllers = (router: express.Router): Controller[] => {
  return [...collectSimpleController(router, controllerCollection)];
};
