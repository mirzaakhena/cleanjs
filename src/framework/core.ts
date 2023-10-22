import { generateID } from "../utility.js";

export type Context<T = any> = {
  data: T;
  traceId: string;
  date: Date;
};

export const getContext = <T = any>(data: T): Context<T> => {
  return {
    data,
    date: new Date(),
    traceId: generateID(),
  };
};

export type Inport<REQUEST = any, RESPONSE = any> = (ctx: Context, request: REQUEST) => Promise<RESPONSE>;

export type Outport<T extends Record<string, Inport> = Record<string, Inport>> = T;

export type InputResponseWithCount<T> = { items: T[]; count: number };

export type Usecase<O extends Outport = any, REQ = any, RES = any> = {
  execute: (outport: O) => Inport<REQ, RES>;
  gatewayNames: Array<keyof O>;
};

export type Controller = {
  controller: (executables: Record<string, Inport>) => void;
  usecaseNames: string[];
};

export type FunctionType = "controller" | "gateway";

export type RequestType = "command" | "query";

export type Gateways = Record<
  string,
  {
    gateway: Inport | null;
    requestType: RequestType;
  }
>;

export type Usecases = Record<string, Usecase>;

export type Middleware = (funcType: FunctionType, requestType: RequestType, name: string, x: Inport) => Inport;

export type UsecaseWithGatewayInstance = Record<
  string,
  {
    requestType: RequestType;
    inport: Inport;
    usecase: Usecase;
  }
>;

export function propertyExistsAndHasValue<T extends object>(obj: T, prop: keyof T): obj is T & { [K in keyof T]: NonNullable<T[K]> } {
  return prop in obj && obj[prop] !== null && obj[prop] !== undefined;
}

export const bootstrap = (gateways: Gateways, usecases: Usecases, controllers: Controller[], middlewares: Middleware[]): UsecaseWithGatewayInstance => {
  //

  let usecasesWithGatewayInstance: UsecaseWithGatewayInstance = {};

  // untuk setiap usecase yang ada
  for (const usecaseName in usecases) {
    //

    let o: Outport = {};
    let requestType: RequestType = "query";

    // kita akan iterasi semua gateway yang diperlukan oleh usecase
    for (const gatewayName of usecases[usecaseName].gatewayNames) {
      //

      const gatewayNameAsString = gatewayName as string;

      if (!propertyExistsAndHasValue(gateways, gatewayNameAsString)) {
        throw new Error(`'${gatewayNameAsString}' is not exist in application -> usecases -> [${usecaseName}] -> gateways`);
      }

      // jalankan decorator pattern
      let current: Inport = gateways[gatewayNameAsString].gateway!;
      for (const middleware of middlewares) {
        current = middleware("gateway", gateways[gatewayNameAsString].requestType, gatewayNameAsString, current);
      }

      o = { ...o, [gatewayNameAsString]: current };

      // jika some of gateway tersebut adalah command, maka usecase tersebut juga command
      if (gateways[gatewayNameAsString].requestType === "command" && requestType !== "command") {
        requestType = "command";
      }
    }

    usecasesWithGatewayInstance = {
      ...usecasesWithGatewayInstance,
      [usecaseName]: {
        inport: usecases[usecaseName].execute(o),
        requestType,
        usecase: usecases[usecaseName],
      },
    };

    //
  }

  // untuk setiap controller
  for (const c of controllers) {
    //

    let newU: Record<string, Inport<any, any>> = {};

    for (const usecaseName of c.usecaseNames) {
      //
      if (!propertyExistsAndHasValue(usecasesWithGatewayInstance, usecaseName)) {
        throw new Error(`'${usecaseName}' is not exist in application -> controllers -> [${controllers.indexOf(c)}] -> usecases`);
      }

      // jalankan decorator pattern
      let current: Inport = usecasesWithGatewayInstance[usecaseName].inport;
      for (const middleware of middlewares) {
        current = middleware("controller", usecasesWithGatewayInstance[usecaseName].requestType, usecaseName, current);
      }

      newU = { ...newU, [usecaseName]: current };
    }

    c.controller(newU);
    //
  }

  return usecasesWithGatewayInstance;
};

export const createController = <T extends string>(usecases: T[] | Record<T, any>, controller: (_: Record<T, Inport>) => void): Controller => {
  return { controller, usecaseNames: Array.isArray(usecases) ? usecases : (Object.keys(usecases) as Array<keyof T & string>) };
};

// // sample how to create middleware
// const middlewareSample: Middleware = (funcType, requestType, name, inport) => {
//   //
//   return async (ctx, input) => {
//     //
//     const result = await inport(ctx, input);
//     console.log(">>>> hello", funcType, name);
//     return result;
//   };
// };
