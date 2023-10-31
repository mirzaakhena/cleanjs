import { HTTPData } from "../../framework/controller_express.js";

export const controllerUserPoint: HTTPData[] = [
  {
    description: "Retrieve All Point owned by User",
    method: "get",
    path: "/api/v1/userpoint",
    usecase: "userPointGetAll",
    tag: "user_point",
    query: {
      page: { type: "number", default: 1 },
      size: { type: "number", default: 20 },
    },
    response: {
      200: {
        description: "Success",
        content: {
          items: {
            type: "array",
            items: {
              type: "object",
              properties: {
                id: { type: "string" },
                user: {
                  type: "object",
                  properties: {
                    id: { type: "string", default: "123", description: "id of user" },
                    name: { type: "string", default: "aaa", description: "name of user" },
                    createdDate: { type: "string", description: "registered user date" },
                    totalPoints: { type: "number", default: 0, description: "point own by user" },
                  },
                },
                point: { type: "number", default: 0, description: "point of user" },
                createdDate: { type: "string", description: "" },
              },
            },
          },
          count: { type: "number", default: 0 },
        },
      },
    },
  },
];
