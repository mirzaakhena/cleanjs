import { HTTPData } from "../../framework/data_http.js";

export const controllerStruk: HTTPData[] = [
  {
    description: "Retrieve All Uploaded Struk by User",
    method: "get",
    path: "/api/v1/struk",
    usecase: "strukGetAll",
    tag: "struk",
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
                status: { type: "string" },
                approvalDate: { type: "string" },
                createdDate: { type: "string", description: "" },
                billNumber: { type: "string", description: "" },
                totalTransaksi: { type: "number", default: 0, description: "" },
                user: {
                  type: "object",
                  properties: {
                    id: { type: "string", default: "123", description: "id of user" },
                    name: { type: "string", default: "aaa", description: "name of user" },
                    createdDate: { type: "string", description: "registered user date" },
                    totalPoints: { type: "number", default: 0, description: "point own by user" },
                  },
                },
                screenshot: {
                  type: "object",
                  properties: {
                    name: { type: "string", description: "image name" },
                    url: { type: "string", description: "url of image" },
                  },
                },
              },
            },
          },
          count: { type: "number", default: 0 },
        },
      },
    },
  },
  {
    description: "Upload a Struk by User",
    method: "post",
    path: "/api/v1/struk",
    usecase: "strukUpload",
    tag: "struk",
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
    query: {
      somthing: { type: "string" },
    },
    local: {
      newStrukID: { funcName: "randomString" },
      now: { funcName: "dateNow" },
      // userID: { funcName: "contextData", input: "userLogin" },
    },
    response: {
      200: {
        description: "Success",
        content: {
          id: { type: "string", description: "id of new struk" },
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
    description: "Approve or Reject action to Struk",
    method: "post",
    path: "/api/v1/struk/:strukID/approval",
    usecase: "strukApproval",
    tag: "struk",
    param: {
      strukID: { type: "string", description: "id of struk" },
    },
    body: {
      status: { type: "enum", default: "APPROVE", enum: ["APPROVE", "REJECT"] }, // TODO remove default later
    },
    local: {
      newUserPointID: { funcName: "randomString" },
      now: { funcName: "dateNow" },
    },
    response: {
      200: {
        description: "Success",
        content: {
          id: { type: "string", description: "id of struk" },
          status: { type: "string", description: "status struk" },
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
