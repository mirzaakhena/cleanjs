import { BaseEntity, Identifier } from "../../framework/repo.js";

export type ApprovalStatus = "PENDING" | "APPROVED" | "REJECTED";
export type ApprovalActionStatus = "APPROVE" | "REJECT";

export class Approval<T extends Identifier> extends BaseEntity<T> {
  //

  status: ApprovalStatus;
  approvalDate: Date | null;

  updateStatus(now: Date, approvalActionStatus: ApprovalActionStatus) {
    //

    this.approvalDate = now;
    this.status = GetApprovalStatus(approvalActionStatus);

    return this.status;
  }
}

export const GetApprovalStatus = (a: ApprovalActionStatus): ApprovalStatus => {
  //
  if (a === "APPROVE") {
    return "APPROVED";
  }
  if (a === "REJECT") {
    return "REJECTED";
  }

  throw new Error("Invalid ApprovalActionStatus");
};
