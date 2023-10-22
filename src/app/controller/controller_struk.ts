import { HTTPData } from "../../framework/controller_express.js";

export const controllerStruk: HTTPData[] = [
  {
    method: "get",
    route: "/api/v1/struk",
    usecase: "strukGetAll",
    tags: ["struk"],
    query: {
      page: { type: "number", default: 1 },
      size: { type: "number", default: 20 },
    },
  },
  {
    method: "post",
    route: "/api/v1/struk",
    usecase: "strukUpload",
    tags: ["struk"],
    body: {
      billNumber: { type: "string", default: "BILL-123-456" }, // TODO remove default later
      totalTransaksi: { type: "number", default: 50000 }, // TODO remove default later
      screenshot: { type: "object", default: { id: "IMAGE_ID", name: "IMAGE_NAME", url: "IMAGE_URL" } },
    },
    header: {
      userID: { type: "string" },
    },
    local: {
      newStrukID: { funcName: "randomString" },
      now: { funcName: "dateNow" },
      // userID: { funcName: "contextData", input: "userLogin" },
    },
  },
  {
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
  },
];

// adminID: AdminID;
// now: Date;
// newUserPointID: UserPointID;
// StrukID: StrukID;
// approvalStatus: ApprovalActionStatus;
