import { Usecase } from "../../framework/core.js";
import { SaveEntity } from "../../framework/repo.js";
import { Image } from "../model/image.js";
import { Reward, RewardID } from "../model/reward.js";

type Outport = {
  saveReward: SaveEntity<Reward>;
};

export type InportRequest = {
  newRewardID: RewardID;
  now: Date;
  title: string;
  description: string;
  point: number;
  stock: number;
  image: Image;
};

export type InportResponse = {
  id: RewardID;
};

export const rewardCreate: Usecase<Outport, InportRequest, InportResponse> = {
  gatewayNames: [
    //
    "saveReward",
  ],
  execute: (o) => {
    //

    return async (ctx, req) => {
      //

      const obj = new Reward();
      {
        obj.id = req.newRewardID;
        obj.createdDate = req.now;
        obj.title = req.title;
        obj.description = req.description;
        obj.point = req.point;
        obj.stock = req.stock;
        obj.image = req.image;
      }

      await o.saveReward(ctx, obj);

      return { id: req.newRewardID };
    };
  },
};
