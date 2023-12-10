import { BaseEntity, BaseFindManyFilter, Identifier } from "../../framework/repo.js";

export type UserID = Identifier;

export const UserStatus = ["ACTIVE", "NON_ACTIVE"] as const;

export class User extends BaseEntity<UserID> {
  //

  name?: string;
  createdDate?: Date;
  totalPoints?: number;
  status: (typeof UserStatus)[number];

  increasePoint(point: number) {
    this.totalPoints! += point;
  }

  decreasePoint(point: number) {
    if (this.totalPoints! - point < 0) {
      throw new Error("not enough points");
    }
    this.totalPoints! -= point;
  }

  changeStatus(userStatus: (typeof UserStatus)[number]) {
    const statusEnum = ["ACTIVE", "NON_ACTIVE"];
    if (!statusEnum.some((status) => userStatus === status)) {
      throw new Error(`status must be one of ${statusEnum}`);
    }
    this.status! = userStatus;
  }
}

export type FindManyUserFilter = BaseFindManyFilter & {
  //
  nameLike?: string;
  totalPointMin?: number;
  totalPointMax?: number;
  status?: (typeof UserStatus)[number];
  ids?: string[];
};
