import { HTTPData } from "../../framework/data_http.js";

export const controllerUser: HTTPData[] = [
  {
    description: "Get All Registered User",
    method: "get",
    path: "/api/v1/user",
    usecase: "userGetAll",
    tag: "user",
    query: {
      page: { type: "number", default: 1, description: "Page number for pagination" },
      size: { type: "number", default: 20, description: "Number of items per page" },
      nameLike: { type: "string" },
      totalPointMin: { type: "number" },
      totalPointMax: { type: "number" },
      status: { type: "enum", enum: ["ACTIVE", "NON_ACTIVE"] },
    },
    response: {
      200: {
        description: "Success",
        content: {
          name: { type: "string" },
          createdDate: { type: "string" },
          totalPoints: { type: "string" },
          status: { type: "string" },
        },
      },
    },
    responseAsTable: true,
  },
  {
    description: "Registered new User",
    method: "post",
    path: "/api/v1/user",
    usecase: "userCreate",
    tag: "user",
    body: {
      name: { type: "string", default: "mirza", description: "name of the user" },
    },
    local: {
      newUserID: { funcName: "randomString" },
      now: { funcName: "dateNow" },
    },
    response: {
      200: {
        description: "Success",
        content: {
          id: { type: "string", description: "id of new user" },
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
  {
    description: "Change User Status",
    method: "put",
    path: "/api/v1/user/:userID/status",
    usecase: "userChangeStatus",
    tag: "user",
    param: {
      userID: { type: "string", description: "id of user", default: "0" },
    },
    body: {
      status: { type: "enum", enum: ["ACTIVE", "NON_ACTIVE"], description: "status of user", default: "NON_ACTIVE" },
    },
    response: {
      200: {
        description: "Success",
        content: {
          id: { type: "string", description: "id of user" },
          status: { type: "string", description: "status of user" },
        },
      },
      400: {
        description: "Fail",
        content: {
          message: { type: "string", description: "error message" },
        },
      },
      302: {
        description: "Fail",
        content: {
          message: { type: "string", description: "error message" },
        },
      },
    },
  },
];
