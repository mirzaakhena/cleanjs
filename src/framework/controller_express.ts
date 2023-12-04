import express from "express";
import { Context, Inport, createController } from "./core.js";
import { HTTPData } from "./data_http.js";
import { camelToPascalWithSpace, generateID } from "./helper.js";

export type RequestWithContext = express.Request & {
  ctx?: Context;
};

export const middlewareContextWithTraceId = () => {
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

export const constructDeclarativeController = <T = any>(
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

// export const collectSimpleController_ = (router: express.Router, httpDatas: HTTPData[], localFunctions: Record<string, Inport>) => {
//   return httpDatas.map((x) => constructDeclarativeController(router, x, localFunctions));
// };

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
