import express from "express";
import { UsecaseWithGatewayInstance } from "../../framework/core.js";

export const constructGraph = (ug: UsecaseWithGatewayInstance) => {
  //

  const router = express.Router();

  const usecases: string[] = [];

  const usecaseGateways: { from: string; to: string }[] = [];

  const setOfGateway: Set<string> = new Set();
  for (const key in ug) {
    //

    ug[key].usecase.gatewayNames.forEach((x) => {
      setOfGateway.add(x as string);
      usecaseGateways.push({ from: key, to: x as string });
    });

    usecases.push(key);
  }
  const gateways: string[] = [...setOfGateway];

  router.get("/", (req, res) => {
    res.json({ usecases, gateways, usecaseGateways });
  });

  return router;
};
