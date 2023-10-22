import { HTTPData } from "../../framework/controller_express.js";
import { NewOpenAPI, controllerToSwagger } from "./converter.js";
import swaggerUi from "swagger-ui-express";
import { OpenAPIObject } from "./schema.js";

export const controllerToOpenAPI = (httpDatas: HTTPData[]): OpenAPIObject => {
  const openapiObj = NewOpenAPI();
  for (const c of httpDatas) {
    controllerToSwagger(c, openapiObj);
  }

  return openapiObj;
};
