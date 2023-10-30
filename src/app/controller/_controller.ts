import express from "express";
import { HTTPData, collectSimpleController } from "../../framework/controller_express.js";
import { Context, Controller } from "../../framework/core.js";
import { generateID } from "../../utility.js";
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

// export const controllers_ = (router: express.Router): Controller[] => {
//   return [...collectSimpleController(router, controllerCollection, localFunctions)];
// };

const localFunctions = {
  dateNow: async (ctx: Context, _: void) => {
    return new Date();
  },
  randomString: async (ctx: Context, charCount?: number) => {
    return generateID(charCount ?? undefined);
  },
  contextData: async (ctx: Context, input: string) => {
    return ctx.data[input];
  },
};

// const checkLocalData_mirza = (ctx: Context, key: string, ft: FuncType): any => {
// if (ft.funcName === "dateNow") {
//   return new Date();
// }

// if (ft.funcName === "randomString") {
//   return generateID((ft.input as number) ?? undefined);
// }

// if (ft.funcName === "contextData") {
//   if (ft.input === undefined) {
//     throw new Error(`unknown input for function ${ft.funcName} key ${key}`);
//   }

//   return ctx.data[ft.input as string];
// }

// if (ft.funcName === "assign") {
//   if (ft.input === undefined) {
//     throw new Error(`unknown input for function ${ft.funcName} key ${key}`);
//   }
//   return ft.input;
// }

//   throw new Error(`unknown function ${ft.funcName}`);
// };
