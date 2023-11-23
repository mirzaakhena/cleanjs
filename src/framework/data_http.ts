import { InputType } from "./data_type.js";

export type Tags = {
  tag: string;
  httpDatas: HTTPData[];
};

export type ResponseCode = 200 | 201 | 400 | 401 | number;

export type Methods = "all" | "get" | "post" | "put" | "delete" | "patch" | "options" | "head";

export type FuncType = { funcName: string; input?: any };

export type HeaderType = {
  location: string;
};

export type ResponseType = {
  description?: string;
  summary?: string;
  headers?: HeaderType;
  content: Record<string, InputType>;
};

export type HTTPData = {
  description?: string;
  usecase: string;
  method: Methods;
  path: string;
  tag: string;
  cookie?: Record<string, InputType>;
  query?: Record<string, InputType>;
  param?: Record<string, InputType>;
  header?: Record<string, InputType>;
  body?: Record<string, InputType>;
  local?: Record<string, FuncType>;
  response?: Record<ResponseCode, ResponseType>;
};
