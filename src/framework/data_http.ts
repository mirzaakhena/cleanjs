import { DeepPartial, InputType, ShallowPartial } from "./data_type.js";

// export type Tags = {
//   tag: string;
//   httpDatas: HTTPData[];
// };

export type ResponseCode = 200 | 201 | 400 | 401 | number;

export type Methods = "all" | "get" | "post" | "put" | "delete" | "patch" | "options" | "head";

export type FuncType = { funcName: string; input?: any };

export type HeaderType = {
  location: string;
};

export type ResponseType<RESPONSE> = {
  description?: string;
  summary?: string;
  headers?: HeaderType;
  content: DeepPartial<RESPONSE>;
};

export type HTTPData<REQUEST = any, RESPONSE = any> = {
  description?: string;
  usecase: string;
  method: Methods;
  path: string;
  tag: string;
  query?: ShallowPartial<REQUEST>;
  param?: ShallowPartial<REQUEST>;
  header?: ShallowPartial<REQUEST>;
  body?: DeepPartial<REQUEST>;
  local?: ShallowPartial<REQUEST, FuncType>;
  response?: Record<ResponseCode, ResponseType<RESPONSE>>;
  responseAsTable?: boolean;
};
