import { InputResponseWithCount, Usecase } from "../../framework/core.js";
import { FindManyEntity } from "../../framework/repo.js";
import { FindManyReceiptFilter, Receipt } from "../model/receipt.js";

type Outport = {
  findManyReceipt: FindManyEntity<Receipt, FindManyReceiptFilter>;
};

export type InportRequest = FindManyReceiptFilter & {
  // other field
};

export type InportResponse = InputResponseWithCount<Receipt> & {
  // other field
};

export const receiptGetAll: Usecase<Outport, InportRequest, InportResponse> = {
  gatewayNames: ["findManyReceipt"],
  execute: (o) => async (ctx, req) => {
    const [items, count] = await o.findManyReceipt(ctx, req);
    return { items, count };
  },
};
