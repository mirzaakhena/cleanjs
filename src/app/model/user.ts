import { BaseEntity, BaseFindManyFilter, Identifier } from "../../framework/repo.js";

export type UserID = Identifier;

export type Gender = "MALE" | "FEMALE";

export class User extends BaseEntity<UserID> {
  name?: string;
  createdDate?: Date;
  totalPoints?: number;

  // phone?: string;
  // gender?: Gender;
  // birthDate?: Date;
  // address?: string;
  // kecamatan?: string;
  // kabupatenOrKota?: string;
  // kodeRefferal?: string;

  readonly increasePoint? = (point: number) => (this.totalPoints! += point);

  readonly decreasePoint? = (point: number) => {
    if (this.totalPoints! - point < 0) {
      throw new Error("not enough points");
    }
    this.totalPoints! -= point;
  };
}

// =============================================================================================================================

export type FindManyUserFilter = BaseFindManyFilter & {
  //
};

// =============================================================================================================================

// export const ServiceUserIncreasePoint = (obj: User, point: number) => {
//   obj.totalPoints! += point;
// };

// export const ServiceUserDecreasePoint = (obj: User, point: number) => {
//   obj.totalPoints! -= point;
// };
