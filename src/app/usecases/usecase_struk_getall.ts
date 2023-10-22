import { InputResponseWithCount, Usecase } from "../../framework/core.js";
import { FindManyEntity } from "../../framework/repo.js";
import { FindManyStrukFilter, Struk } from "../model/struk.js";

type Outport = {
  findManyStruk: FindManyEntity<Struk, FindManyStrukFilter>;
};

export type InportRequest = FindManyStrukFilter & {
  // other field
};

export type InportResponse = InputResponseWithCount<Struk> & {
  // other field
};

export const strukGetAll: Usecase<Outport, InportRequest, InportResponse> = {
  gatewayNames: ["findManyStruk"],
  execute: (o) => async (ctx, req) => {
    const [items, count] = await o.findManyStruk(ctx, req);
    return { items, count };
  },
};
