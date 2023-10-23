import { query } from "express";
import { HTTPData, QueryType } from "../../framework/controller_express.js";
import { OpenAPIObject, OperationObject, ParameterObject, PathItemObject, ReferenceObject, RequestBodyObject, ResponseObject, SchemaObject } from "./schema.js";

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

function handleSchema(name: string, queryType: QueryType): SchemaObject {
  //

  if (queryType.type === "string") {
    return {
      type: "string",
      enum: queryType.enum || undefined,
    };
  }

  if (queryType.type === "number") {
    return {
      type: "integer",
      format: "int64",
    };
  }

  if (queryType.type === "array_of_string") {
    return {
      type: "array",
      items: {
        type: "string",
      },
    };
  }

  if (queryType.type === "array_of_object") {
    return {
      type: "array",
      items: {
        //
        type: "object",
        properties: {},
      },
    };
  }

  // ...Object.entries(queryType.properties).map(x=> {

  //   return []
  // }),

  const schemaObj: SchemaObject = {
    //
  };
  return schemaObj;
}

function extractRoute(input: HTTPData, openApiObj: OpenAPIObject): ParameterObject[] {
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
              description: details.description || undefined, // Handle undefined description
              default: details.default,
              required: details.required || undefined,
              schema: handleSchema(name, details),
            } as ParameterObject)
        )
      : []),
  ];

  // handle params
  // params will directly inject in parameters not in components
  params = [
    ...params,
    ...(input.params
      ? Object.entries(input.params).map(
          ([name, queryType]) =>
            ({
              name,
              in: "path",
              description: queryType.description || undefined, // Handle undefined description
              type: queryType.type === "number" ? "integer" : queryType.type,
              default: queryType.default,
              required: true,
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
              type: queryType.type === "number" ? "integer" : queryType.type,
              default: queryType.default,
            } as ParameterObject)
        )
      : []),
  ];

  return params;
}

function handleProperties(input: Record<string, QueryType>) {
  let schemaObj: Record<string, SchemaObject> = {};

  for (const key in input) {
    const field = input[key];

    if (field.type === "object" && field.properties) {
      schemaObj = {
        ...schemaObj,
        [key]: {
          type: field.type,
          default: field.default,
          description: field.description,
          properties: handleProperties(field.properties),
        } as SchemaObject,
      };

      continue;
    }

    if (field.type === "array" && field.properties) {
      schemaObj = {
        ...schemaObj,
        [key]: {
          type: "array",
          default: [],
          description: field.description,
          items: {
            type: "object",
            properties: handleProperties(field.properties),
          },
        } as SchemaObject,
      };

      continue;
    }

    schemaObj = {
      ...schemaObj,
      [key]: {
        type: field.type === "number" ? "integer" : field.type,
        default: field.default,
        description: field.description,
      } as SchemaObject,
    };
  }

  return schemaObj;
}

export function handleResponse(input: Record<number, Record<string, QueryType>>) {
  type ResponseByCode = {
    [statusCode: string]: ResponseObject;
  };

  let responseByCode: ResponseByCode = {};

  for (const key in input) {
    const field = input[key];

    responseByCode = {
      ...responseByCode,
      [key]: {
        description: "", // TODO: input later
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: handleProperties(field),
            },
          },
        },
      },
    };
  }

  // for (const key in input) {
  //   const field = input[key];

  //   responseByCode = {
  //     ...responseByCode,
  //     [key]: handleProperties(field),
  //   };
  // }

  // description: "", // TODO input it later
  // content: {
  //   "application/json": {
  //     schema: {
  //       type: "object",
  //       properties: handleProperties(input.body),
  //     },
  //   },
  // },

  return responseByCode;
}

export function controllerToSwagger(input: HTTPData, openApiObj: OpenAPIObject) {
  //

  let route = input.route;

  // replace url route from :value into {value}
  if (input.params) {
    Object.keys(input.params).forEach((param) => {
      route = route.replace(`:${param}`, `{${param}}`);
    });
  }

  openApiObj.paths = {
    ...openApiObj.paths,
    [route]: {
      ...openApiObj.paths[route],
      [input.method]: {
        tags: input.tags,
        summary: camelToPascalWithSpace(input.usecase),
        description: input.description ? input.description : input.usecase,
        operationId: input.usecase,
        parameters: extractRoute(input, openApiObj),
        requestBody: input.body && {
          description: "", // TODO input it later
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: handleProperties(input.body),
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

function camelToPascalWithSpace(input: string): string {
  return input
    .replace(/([a-z])([A-Z])/g, "$1 $2") // Add space between camelCase
    .replace(/([a-zA-Z])+/g, (match) => match.charAt(0).toUpperCase() + match.slice(1)); // Convert to PascalCase
}
