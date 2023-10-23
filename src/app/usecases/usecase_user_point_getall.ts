import { InputResponseWithCount, Usecase } from "../../framework/core.js";
import { FindManyEntity } from "../../framework/repo.js";
import { FindManyUserPointFilter, UserPoint } from "../model/user_point.js";

type Outport = {
  findManyUserPoint: FindManyEntity<UserPoint, FindManyUserPointFilter>;
};

export type InportRequest = FindManyUserPointFilter & {
  // other field
};

export type InportResponse = InputResponseWithCount<UserPoint> & {
  // other field
};

export const userPointGetAll: Usecase<Outport, InportRequest, InportResponse> = {
  gatewayNames: ["findManyUserPoint"],
  execute: (o) => async (ctx, req) => {
    const [items, count] = await o.findManyUserPoint(ctx, req);
    return { items, count };
  },
};
