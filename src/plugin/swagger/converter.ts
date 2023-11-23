import { HTTPData, ResponseCode, ResponseType } from "../../framework/data_http.js";
import { InputType } from "../../framework/data_type.js";
import { camelToPascalWithSpace } from "../../utility.js";
import { OpenAPIObject, OperationObject, ParameterObject, PathItemObject, ResponseObject, SchemaObject } from "./schema.js";

export const NewOpenAPI = (): OpenAPIObject => {
  return {
    openapi: "3.0.0",
    info: {
      title: "App",
      version: "1.0.0",
    },
    servers: [
      // {
      //   description: "local",
      //   url: "{protocol}://localhost:{port}/api/v1",
      //   variables: {
      //     protocol: {
      //       enum: ["http", "https"],
      //       default: "http",
      //     },
      //     port: {
      //       enum: ["3000", "443"],
      //       default: "3000",
      //     },
      //     version: {
      //       enum: ["v1", "v2"],
      //       default: "v1",
      //     },
      //   },
      {
        description: "local",
        url: "http://localhost:3000",
      },
      {
        description: "production",
        url: "https://production.com",
      },
    ],
    tags: [
      {
        name: "user",
        description: "data master user",
      },
      {
        name: "struk",
        description: "struk yang di upload user",
      },
      {
        name: "reward",
        description: "data master reward",
      },
      {
        name: "user_reward",
        description: "reward yang di redeem oleh user",
      },
    ],
    paths: {},
    components: {},
  };
};

function extractPath(input: HTTPData, openApiObj: OpenAPIObject): ParameterObject[] {
  //
  let params: ParameterObject[] = [];

  // handle query
  // query will directly inject in parameters not in components
  params = [
    ...params,
    ...(input.query
      ? Object.entries(input.query).map(
          ([name, details]) =>
            ({
              name,
              in: "query",
              // description: `${details.description}` ?? undefined, // Handle undefined description
              // default: details.default,
              required: details.required || undefined,
              // schema: input.query ? handlePropertiesObject(input.query.) : undefined,
              schema: input.query
                ? {
                    type: input.query[name].type === "date" ? "string" : input.query[name].type,
                    default: input.query[name].default ?? undefined,
                    description: input.query[name].description ?? undefined,
                  }
                : undefined,
            } as ParameterObject)
        )
      : []),
  ];

  // handle params
  // params will directly inject in parameters not in components
  params = [
    ...params,
    ...(input.param
      ? Object.entries(input.param).map(
          ([name, queryType]) =>
            ({
              name,
              in: "path",
              required: true,
              schema: {
                type: queryType.type === "number" ? "integer" : queryType.type,
                default: queryType.default,
                description: queryType.description ?? undefined, // Handle undefined description
              },
            } as ParameterObject)
        )
      : []),
  ];

  // handle header
  // header will directly inject in parameters not in components
  params = [
    ...params,
    ...(input.header
      ? Object.entries(input.header).map(
          ([name, queryType]) =>
            ({
              name,
              in: "header",
              description: queryType.description || undefined, // Handle undefined description
              required: true,
              schema: {
                type: queryType.type === "number" ? "integer" : queryType.type,
                default: queryType.default,
              },
            } as ParameterObject)
        )
      : []),
  ];

  return params;
}

function handlePropertiesObject(input: Record<string, InputType>) {
  //

  let schemaObj: Record<string, SchemaObject> = {};

  for (const key in input) {
    //

    const field = input[key];

    const basicField = {
      type: field.type === "date" ? "string" : field.type,
      default: field.default ?? undefined,
      description: field.description ?? undefined,
    };

    if (field.type === "object" && field.properties) {
      schemaObj = {
        ...schemaObj,
        [key]: {
          ...basicField,
          properties: handlePropertiesObject(field.properties),
        } as SchemaObject,
      };
      continue;
    }

    if (field.type === "array") {
      schemaObj = {
        ...schemaObj,
        [key]: {
          ...basicField,
          items: {
            type: field.items.type,
            properties: field.items.type === "object" ? handlePropertiesObject(field.items.properties) : undefined,
          },
        } as SchemaObject,
      };
      continue;
    }

    {
      schemaObj = {
        ...schemaObj,
        [key]: {
          ...basicField,
        } as SchemaObject,
      };
    }
  }

  return schemaObj;
}

export function handleResponse(input: Record<ResponseCode, ResponseType>) {
  type ResponseByCode = {
    [statusCode: string]: ResponseObject;
  };

  let responseByCode: ResponseByCode = {};

  for (const key in input) {
    const field = input[key];

    responseByCode = {
      ...responseByCode,
      [key]: {
        description: field.description, // TODO: input later
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: handlePropertiesObject(field.content),
            },
          },
        },
      },
    };
  }

  return responseByCode;
}

export function controllerToSwagger(input: HTTPData, openApiObj: OpenAPIObject) {
  //

  let path = input.path;

  // replace url path from :value into {value}
  if (input.param) {
    Object.keys(input.param).forEach((param) => {
      path = path.replace(`:${param}`, `{${param}}`);
    });
  }

  openApiObj.paths = {
    ...openApiObj.paths,
    [path]: {
      ...openApiObj.paths[path],
      [input.method]: {
        tags: [input.tag],
        summary: camelToPascalWithSpace(input.usecase),
        description: input.description ? input.description : input.usecase,
        operationId: input.usecase,
        parameters: extractPath(input, openApiObj),
        requestBody: input.body && {
          description: "", // TODO input it later
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: handlePropertiesObject(input.body),
              },
            },
          },
        },
        responses: input.response && handleResponse(input.response),
      } as OperationObject,
    } as PathItemObject,
  };

  //
}
