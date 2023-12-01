import { HTTPData } from "../../framework/data_http.js";

export const controllerUserReward: HTTPData[] = [
  {
    description: "Retrieve All Reward owned by User",
    method: "get",
    path: "/api/v1/userreward",
    usecase: "userRewardGetAll",
    tag: "user_reward",
    query: {
      page: { type: "number", default: 1 },
      size: { type: "number", default: 20 },
    },
    response: {
      200: {
        description: "Success",
        content: {
          status: { type: "string" },
          approvalDate: { type: "string" },
          createdDate: { type: "string", description: "" },
        },
      },
    },
    responseAsTable: true,
  },
  {
    description: "Approve or Reject Reward owned by User",
    method: "post",
    path: "/api/v1/userreward/:userRewardID/approval",
    usecase: "userRewardApproval",
    tag: "user_reward",
    param: {
      userRewardID: { type: "string", description: "id of userReward", default: "0" },
    },
    body: {
      status: { type: "enum", default: "APPROVE", enum: ["APPROVE", "REJECT"] },
    },
    local: {
      now: { funcName: "dateNow" },
      newUserPointID: { funcName: "randomString" },
    },
    response: {
      200: {
        description: "Success",
        content: {
          id: { type: "string", description: "id of new reward" },
          status: { type: "string", description: "status approval" },
        },
      },
      400: {
        description: "Fail",
        content: {
          message: { type: "string", description: "error message" },
        },
      },
    },
  },
];
