import { BaseEntity, Identifier } from "../../framework/repo.js";

export const ApprovalStatus = ["PENDING", "APPROVED", "REJECTED"] as const;
export const ApprovalActionStatus = ["APPROVE", "REJECT"] as const;

export type ApprovalStatusType = (typeof ApprovalStatus)[number];
export type ApprovalActionStatusType = (typeof ApprovalActionStatus)[number];

export class Approval<T extends Identifier> extends BaseEntity<T> {
  //

  status: ApprovalStatusType;
  approvalDate: Date | null;

  updateStatus(now: Date, approvalActionStatus: ApprovalActionStatusType) {
    //

    this.approvalDate = now;
    this.status = GetApprovalStatus(approvalActionStatus);

    return this.status;
  }
}

export const GetApprovalStatus = (a: ApprovalActionStatusType): ApprovalStatusType => {
  //
  if (a === "APPROVE") {
    return "APPROVED";
  }
  if (a === "REJECT") {
    return "REJECTED";
  }

  throw new Error("Invalid ApprovalActionStatus");
};
