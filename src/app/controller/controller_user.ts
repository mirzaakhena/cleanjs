import { HTTPData } from "../../framework/controller_express.js";

export const controllerUser: HTTPData[] = [
  {
    method: "get",
    route: "/api/v1/user",
    usecase: "userGetAll",
    tags: ["user"],
    query: {
      page: { type: "number", default: 1, description: "Page number for pagination" },
      size: { type: "number", default: 20, description: "Number of items per page" },
    },
  },
  {
    method: "post",
    route: "/api/v1/user",
    usecase: "userCreate",
    tags: ["user"],
    body: {
      name: { type: "string", default: "mirza", description: "name of the user" },
    },
    local: {
      newUserID: { funcName: "randomString" },
      now: { funcName: "dateNow" },
    },
  },
];
