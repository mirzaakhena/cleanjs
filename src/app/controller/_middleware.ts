import express from "express";
import { RequestWithContext } from "../../framework/controller_express.js";

export const handleUser = () => {
  return (req: RequestWithContext, res: express.Response, next: express.NextFunction) => {
    //

    if (req.ctx) {
      req.ctx.data["userLogin"] = "zunan";
      req.ctx.data["adminLogin"] = "omar";
    }

    return next();

    //
  };
};

export const handleError = () => {
  return (err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    //

    return res.status(400).json({
      status: 400,
      message: err.message,
    });

    //
  };
};
