import { Usecase } from "../../framework/core.js";
import { FindOneEntity, SaveEntity } from "../../framework/repo.js";
import { Receipt, ReceiptID } from "../model/receipt.js";
import { User, UserID } from "../model/user.js";

type Outport = {
  findOneUser: FindOneEntity<User, UserID>;
  saveReceipt: SaveEntity<Receipt>;
};

export type InportRequest = {
  newReceiptID: ReceiptID;
  userID: UserID;
  now: Date;
  billNumber: string;
  totalTransaksi: number;
};

export type InportResponse = {
  id: ReceiptID;
};

export const receiptUpload: Usecase<Outport, InportRequest, InportResponse> = {
  gatewayNames: [
    //
    "saveReceipt",
    "findOneUser",
  ],
  execute: (o) => {
    //

    return async (ctx, req) => {
      //

      const user = await o.findOneUser(ctx, req.userID);
      if (!user) {
        throw new Error("User not found");
      }

      if (user.status === "NON_ACTIVE") {
        throw new Error("User is non active");
      }

      const obj = new Receipt();
      {
        obj.id = req.newReceiptID;
        obj.createdDate = req.now;
        obj.user = user;
        obj.billNumber = req.billNumber;
        obj.totalTransaksi = req.totalTransaksi;
        obj.status = "PENDING";
        obj.approvalDate = null;
      }

      await o.saveReceipt(ctx, obj);

      return { id: req.newReceiptID };
    };
  },
};
