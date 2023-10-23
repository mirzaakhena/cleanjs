import { HTTPData } from "../../framework/controller_express.js";

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
        items: {
          type: "array_of_object",
          properties: {
            id: { type: "string" },
            status: { type: "string" },
            approvalDate: { type: "string" },
            createdDate: { type: "string", description: "" },
            user: {
              type: "object",
              properties: {
                id: { type: "string", default: "123", description: "id of user" },
                name: { type: "string", default: "aaa", description: "name of user" },
                createdDate: { type: "string", description: "registered user date" },
                totalPoints: { type: "number", default: 0, description: "point own by user" },
              },
            },
            reward: {
              type: "object",
              description: "",
              properties: {
                id: { type: "string", description: "" },
                createdDate: { type: "string", description: "" },
                title: { type: "string", description: "" },
                description: { type: "string", description: "" },
                point: { type: "number", description: "", default: 0 },
                stock: { type: "number", description: "", default: 0 },
                image: {
                  type: "object",
                  properties: {
                    name: { type: "string", description: "image name" },
                    url: { type: "string", description: "url of image" },
                  },
                },
              },
            },
          },
        },
        count: { type: "number", default: 0 },
      },
    },
  },
  {
    description: "Approve or Reject Reward owned by User",
    method: "post",
    path: "/api/v1/userreward/:userRewardID/approval",
    usecase: "userRewardApproval",
    tag: "user_reward",
    param: {
      userRewardID: { type: "string", description: "id of userReward", default: 0 },
    },
    body: {
      status: { type: "string", default: "APPROVE", enum: ["APPROVE", "REJECT"] },
    },
    local: {
      now: { funcName: "dateNow" },
      newUserPointID: { funcName: "randomString" },
    },
    response: {
      200: {
        id: { type: "string", description: "id of new reward" },
        status: { type: "string", description: "status approval" },
      },
      400: {
        message: { type: "string", description: "error message" },
      },
    },
  },
];
