import { Usecase } from "../../framework/core.js";
import { FindOneEntity, SaveEntity } from "../../framework/repo.js";
import { ApprovalActionStatus, ApprovalStatus } from "../model/approval.js";
import { Receipt, ReceiptID } from "../model/receipt.js";

import { User, UserID } from "../model/user.js";
import { UserPoint, UserPointID } from "../model/user_point.js";

type Outport = {
  findOneReceipt: FindOneEntity<Receipt, ReceiptID>;
  saveReceipt: SaveEntity<Receipt>;
  saveUserPoint: SaveEntity<UserPoint>;
  saveUser: SaveEntity<User>;
};

export type InportRequest = {
  now: Date;
  newUserPointID: UserPointID;
  receiptID: ReceiptID;
  status: ApprovalActionStatus;
};

export type InportResponse = {
  id: ReceiptID;
  status: ApprovalStatus;
};

export const receiptApproval: Usecase<Outport, InportRequest, InportResponse> = {
  gatewayNames: [
    //
    "saveReceipt",
    "findOneReceipt",
    "saveUserPoint",
    "saveUser",
  ],
  execute: (o) => {
    //

    return async (ctx, req) => {
      //

      // TODO validasi req.adminID

      // cari  receipt
      const objUS = await o.findOneReceipt(ctx, req.receiptID);
      if (!objUS) {
        throw new Error("receipt not found");
      }

      if (objUS.status !== "PENDING") {
        throw new Error(`receipt has been ${objUS.status} before`);
      }

      // ubah status Receipt
      const status = objUS.updateStatus(req.now, req.status);
      await o.saveReceipt(ctx, objUS);

      // Jika di reject langsung keluar saja
      if (status === "REJECTED") {
        return { id: objUS.id, status };
      }

      // FIXME value ini darimana ambilnya?
      const point: number = 10;

      // tambahkan user point
      {
        const objUP = new UserPoint();
        {
          //
          objUP.id = req.newUserPointID;
          objUP.user = objUS.user;
          objUP.createdDate = req.now;
          objUP.point = point;
        }
        await o.saveUserPoint(ctx, objUP);
      }

      // increment point pada user
      {
        objUS.user.increasePoint(point);
        await o.saveUser(ctx, objUS.user);
      }

      return { id: objUS.id, status };
    };
  },
};
