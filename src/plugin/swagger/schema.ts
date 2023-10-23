// https://editor-next.swagger.io/
// https://spec.openapis.org/oas/v3.1.0

export type SchemaObject = {
  title?: string;
  multipleOf?: number;
  maximum?: number;
  exclusiveMaximum?: number;
  minimum?: number;
  exclusiveMinimum?: number;
  maxLength?: number;
  minLength?: number;
  pattern?: string;
  maxItems?: number;
  minItems?: number;
  uniqueItems?: boolean;
  maxProperties?: number;
  minProperties?: number;
  required?: string[];
  enum?: any[];
  type?: "string" | "number" | "integer" | "boolean" | "null" | "object" | "array" | "any";
  allOf?: (SchemaObject | ReferenceObject)[];
  oneOf?: (SchemaObject | ReferenceObject)[];
  anyOf?: (SchemaObject | ReferenceObject)[];
  not?: SchemaObject | ReferenceObject;
  items?: SchemaObject | ReferenceObject | (SchemaObject | ReferenceObject)[];
  properties?: {
    [property: string]: SchemaObject | ReferenceObject;
  };
  additionalProperties?: boolean | SchemaObject | ReferenceObject;
  description?: string;
  format?: "int32" | "int64" | "float" | "double" | "password" | "binary";
  default?: any;
  nullable?: boolean;
  example?: any;
};

export type ExampleObject = {
  summary?: string;
  description?: string;
  value?: any;
  externalValue?: string;
};

export type RequestBodyObject = {
  description?: string;
  content: {
    [mediaType in "application/json"]: MediaTypeObject | ReferenceObject;
  };
  required?: boolean;
};

export type OperationObject = {
  summary?: string;
  tags: string[];
  description?: string;
  operationId?: string;
  parameters?: ParameterObject[];
  requestBody?: RequestBodyObject;
  responses?: {
    [statusCode: string]: ResponseObject;
  };
};

export type ResponseObject = {
  description?: string;
  content?: {
    [mediaType: string]: MediaTypeObject | ReferenceObject;
  };
};

export type ReferenceObject = {
  $ref: string;
};

export type MediaTypeObject = {
  schema?: SchemaObject | ReferenceObject;
  example?: any;
  examples?: {
    [example: string]: ExampleObject | ReferenceObject;
  };
};

export type ServerObject = {
  url: string;
  description?: string;
  variables?: {
    [variable: string]: {
      enum?: string[];
      default: string;
      description?: string;
    };
  };
};

export type ParameterObject = {
  name: string;
  in: "query" | "header" | "path" | "cookie";
  description?: string;
  required?: boolean;
  allowEmptyValue?: boolean;
  style?: "form";
  explode?: true;
  schema?: SchemaObject | ReferenceObject;
  example?: any;
  examples?: {
    [example: string]: ExampleObject | ReferenceObject;
  };
  content?: {
    [mediaType: string]: MediaTypeObject | ReferenceObject;
  };
};

export type ComponentObject = {
  schemas?: {
    [schema: string]: SchemaObject | ReferenceObject;
  };
  responses?: {
    [response: string]: ResponseObject | ReferenceObject;
  };
  parameters?: {
    [parameter: string]: ParameterObject | ReferenceObject;
  };
  examples?: {
    [example: string]: ExampleObject | ReferenceObject;
  };
  requestBodies?: {
    [requestBody: string]: RequestBodyObject | ReferenceObject;
  };
};

export type TagObject = {
  name: string;
  description?: string;
  externalDocs?: ExternalDocsObject;
};

export type ExternalDocsObject = {
  description: string;
  url: string;
};

export type OpenAPIObject = {
  openapi: "3.0.0";
  info: {
    title: string;
    version: string;
    description?: string;
    contact?: {
      email: string;
    };
    license?: {
      name: string;
      url: string;
    };
  };
  externalDocs?: ExternalDocsObject;
  servers?: ServerObject[];
  tags?: TagObject[];
  paths: {
    [path: string]: PathItemObject | ReferenceObject;
  };
  components?: ComponentObject;
};

export type PathItemObject = {
  $ref?: string;
  summary?: string;
  description?: string;
  get?: OperationObject | ReferenceObject;
  put?: OperationObject | ReferenceObject;
  post?: OperationObject | ReferenceObject;
  delete?: OperationObject | ReferenceObject;
  options?: OperationObject | ReferenceObject;
  head?: OperationObject | ReferenceObject;
  patch?: OperationObject | ReferenceObject;
  trace?: OperationObject | ReferenceObject;
  servers?: ServerObject[];
  parameters?: (ParameterObject | ReferenceObject)[];
};
