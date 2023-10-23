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

      const name = req.name.trim();
      if (name === "") {
        throw new Error("name is required");
      }

      const obj = new User();
      {
        obj.id = req.newUserID;
        obj.createdDate = req.now;
        obj.name = name;
        obj.totalPoints = 1000;
        obj.status = "NON_ACTIVE";
      }

      await o.saveUser(ctx, obj);

      return { id: req.newUserID };
    };
  },
};
