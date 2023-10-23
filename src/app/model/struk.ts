import { BaseFindManyFilter, Identifier } from "../../framework/repo.js";
import { Approval, ApprovalStatus } from "./approval.js";
import { Image } from "./image.js";
import { User, UserID } from "./user.js";

// =============================================================================================================================

export type StrukID = Identifier;

export class Struk extends Approval<StrukID> {
  //
  user: User;
  createdDate: Date;
  billNumber: string;
  totalTransaksi: number;
  screenshot: Image;
}

// =============================================================================================================================

export type FindManyStrukFilter = BaseFindManyFilter & {
  //
  userID: UserID;
  billNumber: string;
  status: ApprovalStatus;
};

// =============================================================================================================================
