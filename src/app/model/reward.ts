import { BaseEntity, BaseFindManyFilter, Identifier } from "../../framework/repo.js";

export type RewardID = Identifier;

export class Reward extends BaseEntity<RewardID> {
  createdDate: Date;
  title: string;
  description: string;
  point: number;
  stock: number;

  reduceStock() {
    if (this.stock - 1 < 0) {
      throw new Error("not enough stock");
    }
    this.stock -= 1;
  }
}

// =============================================================================================================================

export type FindManyRewardFilter = BaseFindManyFilter & {
  //
};

// =============================================================================================================================
