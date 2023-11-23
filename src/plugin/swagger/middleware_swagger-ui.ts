import { HTTPData } from "../../framework/data_http.js";
import { NewOpenAPI, controllerToSwagger } from "./converter.js";
import { OpenAPIObject } from "./schema.js";

export const controllerToOpenAPI = (httpDatas: HTTPData[]): OpenAPIObject => {
  const openapiObj = NewOpenAPI();
  for (const c of httpDatas) {
    controllerToSwagger(c, openapiObj);
  }

  return openapiObj;
};
