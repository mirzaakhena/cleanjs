import { BaseEntity, BaseFindManyFilter, Identifier } from "../../framework/repo.js";
import { User } from "./user.js";

// =============================================================================================================================

export type UserPointID = Identifier;

export class UserPoint extends BaseEntity<UserPointID> {
  user: User;
  point: number;
  createdDate: Date;
  // tenant: Tenant;
  // TODO kalau ditambah karena apa?
  // TODO kalau dikurangi dipakai untuk redeem apa?
}

// =============================================================================================================================

export type FindManyUserPointFilter = BaseFindManyFilter & {
  //
};

// =============================================================================================================================
