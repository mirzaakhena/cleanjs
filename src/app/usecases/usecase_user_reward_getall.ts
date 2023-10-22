import { InputResponseWithCount, Usecase } from "../../framework/core.js";
import { FindManyEntity } from "../../framework/repo.js";
import { FindManyUserRewardFilter, UserReward } from "../model/user_reward.js";

type Outport = {
  findManyUserReward: FindManyEntity<UserReward, FindManyUserRewardFilter>;
};

export type InportRequest = FindManyUserRewardFilter & {
  // other field
};

export type InportResponse = InputResponseWithCount<UserReward> & {
  // other field
};

export const userRewardGetAll: Usecase<Outport, InportRequest, InportResponse> = {
  gatewayNames: ["findManyUserReward"],
  execute: (o) => async (ctx, req) => {
    const [items, count] = await o.findManyUserReward(ctx, req);
    return { items, count };
  },
};
