import { InputResponseWithCount, Usecase } from "../../framework/core.js";
import { FindManyEntity } from "../../framework/repo.js";
import { FindManyRewardFilter, Reward } from "../model/reward.js";

type Outport = {
  findManyReward: FindManyEntity<Reward, FindManyRewardFilter>;
};

export type InportRequest = FindManyRewardFilter & {
  // other field
};

export type InportResponse = InputResponseWithCount<Reward> & {
  // other field
};

export const rewardGetAll: Usecase<Outport, InportRequest, InportResponse> = {
  gatewayNames: ["findManyReward"],
  execute: (o) => async (ctx, req) => {
    const [items, count] = await o.findManyReward(ctx, req);
    return { items, count };
  },
};
