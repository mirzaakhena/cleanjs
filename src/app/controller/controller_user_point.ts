import { HTTPData } from "../../framework/data_http.js";

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
          point: { type: "number", default: 0, description: "point of user" },
          createdDate: { type: "string", description: "" },
        },
      },
    },
    responseAsTable: true,
  },
];
