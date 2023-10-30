import { Context } from "../../framework/core.js";
import { generateID } from "../../utility.js";

export const undeterministicFunctions = {
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
