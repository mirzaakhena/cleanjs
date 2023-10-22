import { InputResponseWithCount, Usecase } from "../../framework/core.js";
import { FindManyEntity } from "../../framework/repo.js";
import { FindManyUserFilter, User } from "../model/user.js";

type Outport = {
  findManyUser: FindManyEntity<User, FindManyUserFilter>;
};

export type InportRequest = FindManyUserFilter & {
  // other field
};

export type InportResponse = InputResponseWithCount<User> & {
  // other field
};

export const userGetAll: Usecase<Outport, InportRequest, InportResponse> = {
  gatewayNames: ["findManyUser"],
  execute: (o) => async (ctx, req) => {
    const [items, count] = await o.findManyUser(ctx, req);
    return { items, count };
  },
};
