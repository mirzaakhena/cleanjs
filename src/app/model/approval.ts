import { BaseEntity, Identifier } from "../../framework/repo.js";
import { Admin, AdminID } from "./admin.js";

export type ApprovalStatus = "PENDING" | "APPROVED" | "REJECTED";
export type ApprovalActionStatus = "APPROVE" | "REJECT";

export class Approval<T extends Identifier> extends BaseEntity<T> {
  //

  status: ApprovalStatus;
  // approvalBy: Admin | null;
  approvalDate: Date | null;

  updateStatus(now: Date, adminID: AdminID, approvalActionStatus: ApprovalActionStatus) {
    //

    // this.approvalBy = { id: adminID };
    this.approvalDate = now;
    this.status = GetApprovalStatus(approvalActionStatus);

    return this.status;
  }
}

// export const ServiceApprovalAction = (obj: Approval, now: Date, adminID: AdminID, approvalActionStatus: ApprovalActionStatus) => {
//   //

//   obj.approvalBy = { id: adminID };
//   obj.approvalDate = now;
//   obj.status = GetApprovalStatus(approvalActionStatus);

//   return obj.status;
// };

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
