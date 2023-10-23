import { Usecase } from "../../framework/core.js";
import { FindOneEntity, SaveEntity } from "../../framework/repo.js";
import { ApprovalActionStatus, ApprovalStatus } from "../model/approval.js";
import { Struk, StrukID } from "../model/struk.js";
import { User, UserID } from "../model/user.js";
import { UserPoint, UserPointID } from "../model/user_point.js";

type Outport = {
  findOneStruk: FindOneEntity<Struk, StrukID>;
  saveStruk: SaveEntity<Struk, StrukID>;
  saveUserPoint: SaveEntity<UserPoint, UserPointID>;
  saveUser: SaveEntity<User, UserID>;
};

export type InportRequest = {
  now: Date;
  newUserPointID: UserPointID;
  strukID: StrukID;
  approvalStatus: ApprovalActionStatus;
};

export type InportResponse = {
  id: StrukID;
  status: ApprovalStatus;
};

export const strukApproval: Usecase<Outport, InportRequest, InportResponse> = {
  gatewayNames: [
    //
    "saveStruk",
    "findOneStruk",
    "saveUserPoint",
    "saveUser",
  ],
  execute: (o) => {
    //

    return async (ctx, req) => {
      //

      // TODO validasi req.adminID

      // cari  struk
      const objUS = await o.findOneStruk(ctx, req.strukID);
      if (!objUS) {
        throw new Error("struk not found");
      }

      if (objUS.status !== "PENDING") {
        throw new Error(`struk has been ${objUS.status} before`);
      }

      // ubah status Struk
      const status = objUS.updateStatus(req.now, req.approvalStatus);
      await o.saveStruk(ctx, objUS);

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
          // tenant: objUS.tenant,
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
