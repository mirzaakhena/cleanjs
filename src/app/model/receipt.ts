import { BaseFindManyFilter, Identifier } from "../../framework/repo.js";
import { Approval, ApprovalStatusType } from "./approval.js";
import { User, UserID } from "./user.js";

export type ReceiptID = Identifier;

export class Receipt extends Approval<ReceiptID> {
  //
  user: User;
  createdDate: Date;
  billNumber: string;
  totalTransaksi: number;
}

export type FindManyReceiptFilter = BaseFindManyFilter & {
  //
  userID: UserID;
  billNumber: string;
  status: ApprovalStatusType;
};

// =============================================================================================================================
