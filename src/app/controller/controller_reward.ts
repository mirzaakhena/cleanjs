import { HTTPData } from "../../framework/controller_express.js";

export const controllerReward: HTTPData[] = [
  {
    method: "get",
    route: "/api/v1/reward",
    usecase: "rewardGetAll",
    tags: ["reward"],
    query: {
      page: { type: "number", default: 1, description: "Page number for pagination" },
      size: { type: "number", default: 20, description: "Number of items per page" },
    },
  },
  {
    method: "post",
    route: "/api/v1/reward",
    usecase: "rewardCreate",
    tags: ["reward"],
    body: {
      title: { type: "string", default: "TITLE_REWARD", description: "Title for reward" },
      description: { type: "string", default: "DESC_REWARD", description: "Description for reward" },
      point: { type: "number", default: "10", description: "the number of point for a reward" },
      stock: { type: "number", default: "100", description: "reward quantity" },
      image: { type: "object", default: { id: "IMAGE_ID", name: "IMAGE_NAME", url: "IMAGE_URL" }, description: "image thumbnail information" },
    },
    local: {
      now: { funcName: "dateNow" },
      newRewardID: { funcName: "randomString" },
    },
  },
  {
    method: "post",
    route: "/api/v1/reward/:rewardID/redeem",
    usecase: "rewardRedeem",
    tags: ["reward"],
    params: {
      rewardID: { type: "string", description: "id of reward" },
    },
    header: {
      userID: { type: "string", description: "" },
    },
    local: {
      now: { funcName: "dateNow" },
      newUserRewardID: { funcName: "randomString" },
      // userID: { funcName: "contextData", input: "userLogin" },
    },
  },
];
