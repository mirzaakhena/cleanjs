import express from "express";
import { camelToPascalWithSpace, generateID } from "../utility.js";
import { Context, createController, getContext } from "./core.js";

export type HTTPDataResponse = {
  headers: Record<string, string>;
  statusCode: number;
  body: any;
};

export type ResponseCode = 200 | 201 | 400 | 401 | number;

export type Methods = "all" | "get" | "post" | "put" | "delete" | "patch" | "options" | "head";

export type RequestWithContext = express.Request & {
  ctx?: Context;
};

export const middlewareContext = () => {
  return (req: RequestWithContext, res: express.Response, next: express.NextFunction) => {
    req.ctx = getContext({});
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
  if (defaultValue) {
    return defaultValue;
  }
  if (typeof value === "number" && !isNaN(value)) {
    return value;
  }
  if (typeof value === "string") {
    const numericValue = +value;
    if (!isNaN(numericValue)) {
      return numericValue;
    }
  }
  return undefined;
};

// TODO move it to utility
export const extractBoolean = (value: any): boolean | undefined => {
  return value === "true" ? true : value === "false" ? false : undefined;
};

export type DataType =
  | "string" //
  | "date" //
  | "boolean" //
  | "number" //
  | "object" //
  | "array_of_object" //
  | "array_of_number" //
  | "array_of_string" //
  | "array_of_boolean" //
  | "array_of_date"; //
// | "array_of_array"; //

export type QueryType = {
  type: DataType;
  enum?: string[];
  properties?: Record<string, QueryType>;
  default?: any;
  description?: string;
  required?: boolean;
};

export type FuncName = "dateNow" | "assign" | "randomString" | "contextData";

export type FuncType = { funcName: FuncName; input?: any };

export type HTTPData = {
  description?: string;
  usecase: string;
  method: Methods;
  route: string;
  tags: string[];
  query?: Record<string, QueryType>;
  params?: Record<string, QueryType>;
  header?: Record<string, QueryType>;
  body?: Record<string, QueryType>;
  local?: Record<string, FuncType>;
  response?: Record<ResponseCode, Record<string, QueryType>>;
};

export const simpleController = <T = any>(
  //
  router: express.IRouter,
  httpData: HTTPData
) => {
  //
  return createController([httpData.usecase], (x) => {
    //

    router[httpData.method](httpData.route, async (req, res, next) => {
      //

      const ctx = getRequestWithContext(req);

      try {
        let payload: T | undefined;

        for (const key in httpData.header) {
          payload = {
            ...payload,
            [key]: checkDataType(httpData.header[key], req.get(key)),
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
            [key]: checkDataType(httpData.query[key], req.query[key]),
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
          payload = {
            ...payload,
            [key]: checkLocalData(ctx, key, httpData.local[key]),
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

export const collectSimpleController = (router: express.Router, httpDatas: HTTPData[]) => {
  return httpDatas.map((x) => simpleController(router, x));
};

const checkDataType = (pd: QueryType, value: any): any => {
  //

  if (pd.type === "number") {
    return extractNumber(value, pd.default ?? undefined);
  }

  if (pd.type === "string") {
    return value === undefined ? pd.default ?? undefined : (value as string);
  }

  if (pd.type === "boolean") {
    return value === undefined ? pd.default ?? undefined : extractBoolean(value);
  }

  if (pd.type === "array_of_string") {
    return extractArrayString(value);
  }

  return undefined;
};

const checkLocalData = (ctx: Context, key: string, ft: FuncType): any => {
  if (ft.funcName === "dateNow") {
    return new Date();
  }

  if (ft.funcName === "randomString") {
    return generateID((ft.input as number) ?? undefined);
  }

  if (ft.funcName === "contextData") {
    if (ft.input === undefined) {
      throw new Error(`unknown input for function ${ft.funcName} key ${key}`);
    }

    return ctx.data[ft.input as string];
  }

  if (ft.funcName === "assign") {
    if (ft.input === undefined) {
      throw new Error(`unknown input for function ${ft.funcName} key ${key}`);
    }
    return ft.input;
  }

  throw new Error(`unknown function ${ft.funcName}`);
};

export const printController = (httpDatas: HTTPData[]) => {
  let maxLengthRoute = 0;
  let maxLengthUsecase = 0;
  httpDatas.forEach((x) => {
    if (maxLengthRoute < x.route.toString().length) {
      maxLengthRoute = x.route.toString().length;
    }

    const usecase = camelToPascalWithSpace(x.usecase.toString());

    if (maxLengthUsecase < usecase.length) {
      maxLengthUsecase = usecase.length;
    }
  });

  console.table(
    httpDatas.map((x) => ({
      //
      method: x.method.padStart(6).toUpperCase(),
      route: x.route.toString().padEnd(maxLengthRoute).substring(0),
      usecase: camelToPascalWithSpace(x.usecase).padEnd(maxLengthUsecase).substring(0),
    }))
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
