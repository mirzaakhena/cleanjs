import { HTTPData } from "../../framework/controller_express.js";

export const controllerUserReward: HTTPData[] = [
  {
    method: "get",
    route: "/api/v1/userreward",
    usecase: "userRewardGetAll",
    tags: ["user_reward"],
    query: {
      page: { type: "number", default: 1 },
      size: { type: "number", default: 20 },
    },
  },
  {
    method: "post",
    route: "/api/v1/userreward/:userRewardID/approval",
    usecase: "userRewardApproval",
    tags: ["user_reward"],
    params: {
      userRewardID: { type: "string", description: "id of userReward" },
    },
    body: {
      status: { type: "string", default: "APPROVE" },
    },
    local: {
      now: { funcName: "dateNow" },
      newUserPointID: { funcName: "randomString" },
      adminID: { funcName: "contextData", input: "adminLogin" },
    },
  },
];
