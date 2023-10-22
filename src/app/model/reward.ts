import { BaseFindManyFilter, Identifier } from "../../framework/repo.js";
import { Image } from "./image.js";

export type RewardID = Identifier;

export class Reward {
  id: RewardID;
  createdDate: Date;
  title: string;
  description: string;
  point: number;
  stock: number;
  image: Image;

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

// export const ServiceRewardReduceStock = (obj: Reward) => (obj.stock -= 1);
