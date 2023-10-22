import { Usecase } from "../../framework/core.js";
import { SaveEntity } from "../../framework/repo.js";
import { User, UserID } from "../model/user.js";

type Outport = {
  saveUser: SaveEntity<User, UserID>;
};

export type InportRequest = {
  newUserID: UserID;
  now: Date;
  name: string;
};

export type InportResponse = {
  id: UserID;
};

export const userCreate: Usecase<Outport, InportRequest, InportResponse> = {
  gatewayNames: [
    //
    "saveUser",
  ],
  execute: (o) => {
    //

    return async (ctx, req) => {
      //

      const obj = new User();
      {
        obj.id = req.newUserID;
        obj.createdDate = req.now;
        obj.name = req.name;
        obj.totalPoints = 1000;
      }

      await o.saveUser(ctx, obj);

      return { id: req.newUserID };
    };
  },
};
