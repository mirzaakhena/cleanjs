import { HTTPData } from "../../framework/controller_express.js";
import { NewOpenAPI, controllerToSwagger } from "./converter.js";
import swaggerUi from "swagger-ui-express";

export const swagger = (httpDatas: HTTPData[]) => {
  const openapiObj = NewOpenAPI();
  for (const c of httpDatas) {
    controllerToSwagger(c, openapiObj);
  }
  return [swaggerUi.serve, swaggerUi.setup(openapiObj)];
};
