import { Usecase } from "../../framework/core.js";
import { FindOneEntity, SaveEntity } from "../../framework/repo.js";
import { User, UserID, UserStatus } from "../model/user.js";

type Outport = {
  findOneUser: FindOneEntity<User, UserID>;
  saveUser: SaveEntity<User, UserID>;
};

export type InportRequest = {
  userID: UserID;
  status: UserStatus;
};

export type InportResponse = {
  id: UserID;
  status: UserStatus;
};

export const userChangeStatus: Usecase<Outport, InportRequest, InportResponse> = {
  gatewayNames: [
    //
    "findOneUser",
    "saveUser",
  ],
  execute: (o) => {
    //

    return async (ctx, req) => {
      //

      const user = await o.findOneUser(ctx, req.userID);
      if (!user) {
        throw new Error("User not found");
      }

      user.changeStatus(req.status);

      await o.saveUser(ctx, user);

      return { id: req.userID, status: user.status! };
    };
  },
};
