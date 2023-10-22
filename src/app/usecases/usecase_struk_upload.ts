import { Usecase } from "../../framework/core.js";
import { SaveEntity } from "../../framework/repo.js";
import { Image } from "../model/image.js";
import { LokasiID } from "../model/lokasi.js";
import { TenantID } from "../model/tenant.js";
import { Struk, StrukID } from "../model/struk.js";
import { UserID } from "../model/user.js";

type Outport = {
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
  ],
  execute: (o) => {
    //

    return async (ctx, req) => {
      //

      // TODO validasi req.userID
      // TODO validasi req.locationID
      // TODO validasi req.tenantID
      // TODO create service for creating struk

      const obj = new Struk();
      {
        obj.id = req.newStrukID;
        obj.createdDate = req.now;
        obj.user = { id: req.userID };
        obj.billNumber = req.billNumber;
        obj.totalTransaksi = req.totalTransaksi;
        obj.screenshot = req.screenshot;
        obj.status = "PENDING";
        // obj.approvalBy = null;
        obj.approvalDate = null;
      }

      await o.saveStruk(ctx, obj);

      return { id: req.newStrukID };
    };
  },
};
