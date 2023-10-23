import { BaseEntity, BaseFindManyFilter, Identifier } from "../../framework/repo.js";

export type UserID = Identifier;

export type Gender = "MALE" | "FEMALE";

export type UserStatus = "ACTIVE" | "NON_ACTIVE";

export class User extends BaseEntity<UserID> {
  name?: string;
  createdDate?: Date;
  totalPoints?: number;
  status?: UserStatus;

  increasePoint(point: number) {
    this.totalPoints! += point;
  }

  decreasePoint(point: number) {
    if (this.totalPoints! - point < 0) {
      throw new Error("not enough points");
    }
    this.totalPoints! -= point;
  }

  changeStatus(status: UserStatus) {
    this.status! = status;
  }
}

// =============================================================================================================================

export type FindManyUserFilter = BaseFindManyFilter & {
  //
};

// =============================================================================================================================
