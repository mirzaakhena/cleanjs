import { query } from "express";
import { HTTPData, InputType, ResponseCode, ResponseType } from "../../framework/controller_express.js";
import { OpenAPIObject, OperationObject, ParameterObject, PathItemObject, ReferenceObject, RequestBodyObject, ResponseObject, SchemaObject } from "./schema.js";
import { camelToPascalWithSpace } from "../../utility.js";

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
              description: `${details.description}xxx` || undefined, // Handle undefined description
              default: details.default,
              required: details.required || undefined,
              schema: input.query ? handlePropertiesObject(input.query) : undefined,
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

function handlePropertiesObject(input: InputType) {
  //

  let schemaObj: Record<string, SchemaObject> = {};

  for (const key in input) {
    //

    const field = input[key];

    const basicField = {
      type: field.type === "date" ? "string" : field.type,
      default: field.default,
      description: field.description,
    };

    // if (field.type === "string" || field.type === "number" || field.type === "boolean" || field.type === "date") {
    //   schemaObj = {
    //     ...schemaObj,
    //     [key]: {
    //       ...basicField,
    //     } as SchemaObject,
    //   };
    //   continue;
    // }

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

function handlePropertiesQuery(input: InputType) {
  let schemaObj: Record<string, SchemaObject> = {};

  for (const key in input) {
    const field = input[key];

    // if (field.type === "object" && field.properties) {
    //   schemaObj = {
    //     ...schemaObj,
    //     [key]: {
    //       type: field.type,
    //       default: field.default,
    //       description: field.description,
    //       properties: handleProperties(field.properties),
    //     } as SchemaObject,
    //   };
    //   continue;
    // }

    // if (!field.type.startsWith("array")) {
    //   schemaObj = {
    //     ...schemaObj,
    //     [key]: {
    //       type: field.type === "number" ? "integer" : field.type,
    //       format: field.type === "number" ? "int64" : undefined,
    //       default: field.default,
    //       description: field.description,
    //       enum: field.enum || undefined,
    //     } as SchemaObject,
    //   };
    //   continue;
    // }

    // if (field.type === "array_of_object" && field.properties) {
    //   schemaObj = {
    //     ...schemaObj,
    //     [key]: {
    //       type: "array",
    //       default: [],
    //       description: field.description,
    //       items: {
    //         type: "object",
    //         properties: handleProperties(field.properties),
    //       },
    //     } as SchemaObject,
    //   };
    //   continue;
    // }

    // if (field.type === "array_of_string") {
    //   schemaObj = {
    //     ...schemaObj,
    //     [key]: {
    //       type: "array",
    //       default: [],
    //       description: field.description,
    //       items: {
    //         type: "string",
    //       },
    //     } as SchemaObject,
    //   };
    //   continue;
    // }

    // if (field.type === "array_of_number") {
    //   schemaObj = {
    //     ...schemaObj,
    //     [key]: {
    //       type: "array",
    //       default: [],
    //       description: field.description,
    //       items: {
    //         type: "number",
    //         format: "int64",
    //       },
    //     } as SchemaObject,
    //   };
    //   continue;
    // }

    // if (field.type === "array_of_boolean") {
    //   schemaObj = {
    //     ...schemaObj,
    //     [key]: {
    //       type: "array",
    //       default: [],
    //       description: field.description,
    //       items: {
    //         type: "boolean",
    //       },
    //     } as SchemaObject,
    //   };
    //   continue;
    // }
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
