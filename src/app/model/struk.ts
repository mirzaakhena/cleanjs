import { BaseFindManyFilter, Identifier } from "../../framework/repo.js";
import { AdminID } from "./admin.js";
import { Approval, ApprovalActionStatus, ApprovalStatus, GetApprovalStatus } from "./approval.js";
import { Image } from "./image.js";
import { Lokasi, LokasiID } from "./lokasi.js";
import { Tenant, TenantID } from "./tenant.js";
import { User, UserID } from "./user.js";

// =============================================================================================================================

export type StrukID = Identifier;

export class Struk extends Approval<StrukID> {
  //
  user: User;
  createdDate: Date;
  // lokasi: Lokasi;
  // tenant: Tenant;
  billNumber: string;
  totalTransaksi: number;
  screenshot: Image;
}

// =============================================================================================================================

export type FindManyStrukFilter = BaseFindManyFilter & {
  //
  userID: UserID;
  locationID: LokasiID;
  tenantID: TenantID;
  billNumber: string;
  status: ApprovalStatus;
};

// =============================================================================================================================
