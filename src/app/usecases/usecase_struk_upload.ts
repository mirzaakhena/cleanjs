import { Usecase } from "../../framework/core.js";
import { FindOneEntity, SaveEntity } from "../../framework/repo.js";
import { Image } from "../model/image.js";
import { Struk, StrukID } from "../model/struk.js";
import { User, UserID } from "../model/user.js";

type Outport = {
  findOneUser: FindOneEntity<User, UserID>;
  saveStruk: SaveEntity<Struk, StrukID>;
};

export type InportRequest = {
  newStrukID: StrukID;
  userID: UserID;
  now: Date;
  billNumber: string;
  totalTransaksi: number;
  screenshot: Image;
};

export type InportResponse = {
  id: StrukID;
};

export const strukUpload: Usecase<Outport, InportRequest, InportResponse> = {
  gatewayNames: [
    //
    "saveStruk",
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

      const obj = new Struk();
      {
        obj.id = req.newStrukID;
        obj.createdDate = req.now;
        obj.user = user;
        obj.billNumber = req.billNumber;
        obj.totalTransaksi = req.totalTransaksi;
        obj.screenshot = req.screenshot;
        obj.status = "PENDING";
        obj.approvalDate = null;
      }

      await o.saveStruk(ctx, obj);

      return { id: req.newStrukID };
    };
  },
};
