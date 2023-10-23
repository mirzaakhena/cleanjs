import { HTTPData } from "../../framework/controller_express.js";

export const controllerStruk: HTTPData[] = [
  {
    description: "Retrieve All Uploaded Struk by User",
    method: "get",
    route: "/api/v1/struk",
    usecase: "strukGetAll",
    tags: ["struk"],
    query: {
      page: { type: "number", default: 1 },
      size: { type: "number", default: 20 },
    },
    response: {
      200: {
        items: {
          type: "array",
          properties: {
            id: { type: "string" },
            status: { type: "string" },
            approvalDate: { type: "string" },
            user: {
              type: "object",
              properties: {
                id: { type: "string", default: "123", description: "id of user" },
                name: { type: "string", default: "aaa", description: "name of user" },
                createdDate: { type: "string", description: "registered user date" },
                totalPoints: { type: "number", default: 0, description: "point own by user" },
              },
            },
            createdDate: { type: "string", description: "" },
            billNumber: { type: "string", description: "" },
            totalTransaksi: { type: "number", default: 0, description: "" },
            screenshot: {
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
    description: "Upload a Struk by User",
    method: "post",
    route: "/api/v1/struk",
    usecase: "strukUpload",
    tags: ["struk"],
    body: {
      billNumber: { type: "string", default: "BILL-123-456" }, // TODO remove default later
      totalTransaksi: { type: "number", default: 50000 }, // TODO remove default later
      screenshot: {
        type: "object",
        properties: {
          id: {
            type: "string",
            default: "IMAGE_ID",
          },
          name: {
            type: "string",
            default: "IMAGE_NAME",
          },
          url: {
            type: "string",
            default: "IMAGE_URL",
          },
        },
      },
    },
    header: {
      userID: { type: "string" },
    },
    local: {
      newStrukID: { funcName: "randomString" },
      now: { funcName: "dateNow" },
      // userID: { funcName: "contextData", input: "userLogin" },
    },
    response: {
      200: {
        id: { type: "string", description: "id of new struk" },
      },
      400: {
        message: { type: "string", description: "error message" },
      },
    },
  },
  {
    description: "Approve or Reject action to Struk",
    method: "post",
    route: "/api/v1/struk/:strukID/approval",
    usecase: "strukApproval",
    tags: ["struk"],
    params: {
      strukID: { type: "string", description: "id of struk" },
    },
    body: {
      approvalStatus: { type: "string", default: "APPROVE" }, // TODO remove default later
    },
    local: {
      newUserPointID: { funcName: "randomString" },
      now: { funcName: "dateNow" },
      adminID: { funcName: "contextData", input: "adminLogin" },
    },
    response: {
      200: {
        id: { type: "string", description: "id of struk" },
        status: { type: "string", description: "status struk" },
      },
      400: {
        message: { type: "string", description: "error message" },
      },
    },
  },
];
