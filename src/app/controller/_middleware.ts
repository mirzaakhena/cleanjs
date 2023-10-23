import express from "express";
import { RequestWithContext } from "../../framework/controller_express.js";
import { setDescriptionToContext } from "../../plugin/recording/recording.js";

export const handleUser = () => {
  return (req: RequestWithContext, res: express.Response, next: express.NextFunction) => {
    //

    if (req.ctx) {
      req.ctx.data["userLogin"] = "zunan";
      req.ctx.data["adminLogin"] = "omar";

      setDescriptionToContext(req.ctx, "mirza");
    }

    return next();

    //
  };
};

export const handleError = () => {
  return (err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    //

    return res.status(400).json({
      message: err.message,
    });

    //
  };
};
