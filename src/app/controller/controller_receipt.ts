import { HTTPData } from "../../framework/data_http.js";
import { InportRequest, InportResponse } from "../usecases/usecase_receipt_getall.js";

// const aaa: HTTPData<InportRequest, InportResponse> = {
//   description: "Retrieve All Uploaded Receipt by User",
//   method: "get",
//   path: "/api/v1/receipt",
//   usecase: "receiptGetAll",
//   tag: "receipt",
//   query: {
//     page: { type: "number", default: 1 },
//     size: { type: "number", default: 20 },
//     billNumber: { type: "number" },
//     status: { type: "enum", enum: ["aaa", "bb"] },
//   },
//   body: {
//     hobbies: {
//       type: "array",
//       items: {
//         type: "object",
//         properties: {
//           bobo: {
//             type: "object",
//             properties: {
//               zzzz: {
//                 type: "number",
//               },
//             },
//           },
//         },
//       },
//     },
//   },
//   response: {
//     200: {
//       description: "Success",
//       content: {
//         count: { type: "number" },
//         items: {
//           type: "array",
//           items: {
//             type: "object",
//             properties: {
//               user: {
//                 type: "object",
//                 properties: {
//                   name: { type: "string" },
//                 },
//               },
//             },
//           },
//         },
//       },
//     },
//   },
//   responseAsTable: true,
// };

export const controllerReceipt: HTTPData[] = [
  {
    description: "Retrieve All Uploaded Receipt by User",
    method: "get",
    path: "/api/v1/receipt",
    usecase: "receiptGetAll",
    tag: "receipt",
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
          billNumber: { type: "string", description: "" },
          totalTransaksi: { type: "number", default: 0, description: "" },
        },
      },
    },
    responseAsTable: true,
  },
  {
    description: "Upload a Receipt by User",
    method: "post",
    path: "/api/v1/receipt",
    usecase: "receiptUpload",
    tag: "receipt",
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
      newReceiptID: { funcName: "randomString" },
      now: { funcName: "dateNow" },
    },
    response: {
      200: {
        description: "Success",
        content: {
          id: { type: "string", description: "id of new receipt" },
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
    description: "Approve or Reject action to Receipt",
    method: "post",
    path: "/api/v1/receipt/:receiptID/approval",
    usecase: "receiptApproval",
    tag: "receipt",
    param: {
      receiptID: { type: "string", description: "id of receipt" },
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
          id: { type: "string", description: "id of receipt" },
          status: { type: "string", description: "status receipt" },
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

// type User = {
//   name: Name;
//   address: string;
//   age: number;
// };

// type Name = {
//   firstName: string;
//   lastName: string;
// };

// type DeepPartial<T> = {
//   [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : boolean;
// };

// type Something<T extends object> = {
//   param?: DeepPartial<T>;
// };

// const u: Something<User> = {
//   param: {
//     name: {
//       firstName: true,
//     },
//     age: true,
//   },
// };

type User = {
  name: Name;
  address: string;
  age: number;
};

type Name = {
  firstName: Yoyo;
  lastName: string;
};

type Yoyo = {
  x: number;
  y: number;
};

type Primitive = {
  type: "string" | "number";
};

type Object<T> = {
  type: "object";
  properties: DeepPartial<T>;
};

type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? (T[K] extends Array<any> ? Array<DeepPartial<T[K][number]>> : Object<T[K]>) : Primitive;
};

type Something<T extends object> = {
  param?: DeepPartial<T>;
};

const u: Something<User> = {
  param: {
    name: {
      type: "object",
      properties: {
        firstName: {
          type: "object",
          properties: {
            x: { type: "number" },
            y: { type: "number" },
          },
        },
      },
    },
  },
};
