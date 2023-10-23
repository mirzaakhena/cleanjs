import { HTTPData } from "../../framework/controller_express.js";

export const controllerUser: HTTPData[] = [
  {
    description: "Get All Registered User",
    method: "get",
    route: "/api/v1/user",
    usecase: "userGetAll",
    tags: ["user"],
    query: {
      page: { type: "number", default: 1, description: "Page number for pagination" },
      size: { type: "number", default: 20, description: "Number of items per page" },
    },
    response: {
      200: {
        items: {
          type: "array",
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
        count: { type: "number", default: 0 },
      },
    },
  },
  {
    description: "Registered new User",
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
    response: {
      200: {
        id: { type: "string", description: "id of new user" },
      },
      400: {
        message: { type: "string", description: "error message" },
      },
    },
  },
];
