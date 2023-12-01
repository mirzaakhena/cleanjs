import express from "express";
import { camelToPascalWithSpace, generateID } from "./helper.js";
import { Context, Inport, createController } from "./core.js";
import { HTTPData } from "./data_http.js";

export type HTTPDataResponse = {
  headers: Record<string, string>;
  statusCode: number;
  body: any;
};

export type RequestWithContext = express.Request & {
  ctx?: Context;
};

export const middlewareContext = () => {
  return (req: RequestWithContext, res: express.Response, next: express.NextFunction) => {
    req.ctx = {
      data: {},
      date: new Date(),
      traceId: generateID(),
    };
    res.set("TraceId", req.ctx.traceId);
    return next();
  };
};

export const getRequestWithContext = (req: express.Request): Context => {
  return (req as RequestWithContext).ctx as Context;
};

// TODO move it to utility
export const extractArrayString = (values: any) => (Array.isArray(values) ? [...values] : values ? [values] : []);

// TODO move it to utility
export const extractNumber = (value: any, defaultValue?: any): number | undefined => {
  if (typeof value === "number" && !isNaN(value)) {
    return value;
  } else if (typeof value === "string") {
    const numericValue = +value;
    if (!isNaN(numericValue)) {
      return numericValue;
    }
  } else if (defaultValue) {
    return defaultValue;
  }
  return undefined;
};

// TODO move it to utility
export const extractBoolean = (value: any): boolean | undefined => {
  return value === "true" ? true : value === "false" ? false : undefined;
};

// export type ResponseCode = 200 | 201 | 302 | 400 | 401 | number;

// export type Methods = "all" | "get" | "post" | "put" | "delete" | "patch" | "options" | "head";

// export type DataType =
//   | "string" //
//   | "boolean" //
//   | "number" //
//   | "array_of_string"; //

// export type QueryType = {
//   type: DataType;
//   enum?: string[];
//   properties?: Record<string, QueryType>;
//   default?: any;
//   description?: string;
//   required?: boolean;
// };

// export type FuncName = "dateNow" | "assign" | "randomString" | "contextData";

// export type FuncType = { funcName: string; input?: any };

// export type HeaderType = {
//   location: string;
// };

// export type ResponseType = {
//   description?: string;
//   summary?: string;
//   headers?: HeaderType;
//   content: InputType;
// };

// export type HTTPData = {
//   description?: string;
//   summary?: string;
//   usecase: string;
//   method: Methods;
//   path: string;
//   tag: string;
//   query?: InputType;
//   param?: InputType;
//   header?: InputType;
//   body?: InputType;
//   local?: Record<string, FuncType>;
//   response?: Record<ResponseCode, ResponseType>;
// };

// //================================================================

// type GeneralInfoType = {
//   default?: any;
//   summary?: string;
//   description?: string;
//   required?: boolean;
// };

// export type EnumerableField = GeneralInfoType & {
//   type: "string" | "number" | "boolean" | "date";
//   enum?: (string | boolean | number)[];
//   textAreaLine?: number;
//   maxLength?: number;
//   isPassword?: boolean;
// };

// export type ObjectField = GeneralInfoType & {
//   type: "object";
//   properties: Record<string, EnumerableField | ObjectField | ArrayField>;
// };

// export type ArrayField = GeneralInfoType & {
//   type: "array";
//   items: EnumerableField | ObjectField | ArrayField;
// };

// export type InputType = Record<string, EnumerableField | ObjectField | ArrayField>;

//================================================================

const simpleController = <T = any>(
  //
  router: express.IRouter,
  httpData: HTTPData,
  localFunctions: Record<string, Inport>
) => {
  //
  return createController([httpData.usecase], (x) => {
    //

    router[httpData.method](httpData.path, async (req, res, next) => {
      //

      const ctx = getRequestWithContext(req);

      try {
        let payload: T | undefined;

        for (const key in httpData.header) {
          payload = {
            ...payload,
            [key]: checkDataType(httpData.header[key].type, httpData.header[key].default, req.get(key)),
          } as T;
        }

        for (const key in req.params) {
          payload = {
            ...payload,
            [key]: req.params[key],
          } as T;
        }

        for (const key in httpData.query) {
          payload = {
            ...payload,
            [key]: checkDataType(httpData.query[key].type, httpData.query[key].default, req.query[key]),
          } as T;
        }

        for (const key in httpData.body) {
          payload = {
            ...payload,
            [key]: req.body[key] ?? undefined,
          } as T;
        }

        for (const key in httpData.local) {
          //

          const localVar = httpData.local[key]; // localFunctions[key];

          const func = localFunctions[localVar.funcName];
          if (!func) {
            throw new Error(`local function ${localVar.funcName} is not defined`);
          }

          payload = {
            ...payload,
            [key]: await func(ctx, httpData.local[key].input), // checkLocalData(ctx, key, httpData.local[key]),
          } as T;
        }

        const result = await x[httpData.usecase](ctx, payload);
        res.json(result);
      } catch (error) {
        next(error);
      }

      //
    });

    //
  });
};

export const collectSimpleController = (router: express.Router, httpDatas: HTTPData[], localFunctions: Record<string, Inport>) => {
  return httpDatas.map((x) => simpleController(router, x, localFunctions));
};

const checkDataType = (type: string, defaultValue: any, value: any): any => {
  //

  if (type === "number") {
    return extractNumber(value, defaultValue ?? undefined);
  }

  if (type === "string" || type === "enum") {
    return value === undefined ? defaultValue ?? undefined : (value as string);
  }

  if (type === "boolean") {
    return value === undefined ? defaultValue ?? undefined : extractBoolean(value);
  }

  if (type === "array") {
    return extractArrayString(value);
  }

  return undefined;
};

export const printController = (httpDatas: HTTPData[]) => {
  let maxLengthRoute = 0;
  let maxLengthUsecase = 0;
  let maxLengthTag = 0;
  httpDatas.forEach((x) => {
    if (maxLengthRoute < x.path.toString().length) {
      maxLengthRoute = x.path.toString().length;
    }

    const usecase = camelToPascalWithSpace(x.usecase.toString());
    if (maxLengthUsecase < usecase.length) {
      maxLengthUsecase = usecase.length;
    }

    if (maxLengthTag < x.tag.length) {
      maxLengthTag = x.tag.length;
    }
  });

  let tag = "";

  console.table(
    //

    httpDatas.map((x) => {
      //

      let groupLabel = x.tag;

      if (tag !== x.tag) {
        tag = x.tag;
      } else {
        groupLabel = "";
      }

      return {
        //
        tag: groupLabel.toUpperCase().padEnd(maxLengthTag),
        usecase: camelToPascalWithSpace(x.usecase).padEnd(maxLengthUsecase).substring(0),
        method: x.method.padStart(6).toUpperCase(),
        path: x.path.toString().padEnd(maxLengthRoute).substring(0),
      };
    })
  );
};

// TODO move it to utility
// export const printRouteToConsole = (url: string, router: express.Router) => {
//   //

//   let route;
//   let routes: any = [];

//   let maxLength = 0;

//   router.stack.forEach(function (middleware) {
//     if (middleware.route) {
//       // routes registered directly on the app
//       routes.push(middleware.route);
//       if (maxLength < middleware.route.path.toString().length) {
//         maxLength = middleware.route.path.toString().length;
//       }
//     } else if (middleware.name === "router") {
//       // router middleware
//       middleware.handle.stack.forEach(function (handler: any) {
//         route = handler.route;
//         route && routes.push(route);
//       });
//     }
//   });

//   console.table(
//     routes.map((r: any) => {
//       return {
//         method: Object.keys(r.methods)[0].padStart(6).toUpperCase(),
//         path: `${url}${r.path.toString().padEnd(maxLength).substring(0)}`,
//       };
//     })
//   );
// };

// // Sample how to create basic controller
// createController(["approvalFlow"], (x) => {
//   router.get("/zunan", async (req, res, next) => {
//     try {
//       //
//       const ctx = getRequestWithContext(req);
//       const result = await x.approvalFlow(ctx, 11);
//       res.json(result);
//       //
//     } catch (error) {
//       next(error);
//     }
//   });
//   //
// })
