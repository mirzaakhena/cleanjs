export type Context<T = any> = {
  data: T;
  traceId: string;
  date: Date;
};

export type BasicFunction<REQUEST = any, RESPONSE = any> = (ctx: Context, request: REQUEST) => Promise<RESPONSE>;

export type Inport<REQUEST = any, RESPONSE = any> = BasicFunction<REQUEST, RESPONSE>;

export type Outport<T extends Record<string, BasicFunction> = Record<string, BasicFunction>> = T;

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
    gateway: BasicFunction | null;
    requestType: RequestType;
  }
>;

export type Usecases = Record<string, Usecase>;

export type Middleware = (funcType: FunctionType, requestType: RequestType, name: string, x: BasicFunction) => BasicFunction;

export type UsecaseWithGatewayInstance = Record<
  string,
  {
    requestType: RequestType;
    inport: Inport;
    usecase: Usecase;
  }
>;

function propertyExistsAndHasValue<T extends object>(obj: T, prop: keyof T): obj is T & { [K in keyof T]: NonNullable<T[K]> } {
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
    let modifiedFunctionsCounter = 0;

    // kita akan iterasi semua gateway yang diperlukan oleh usecase
    for (const gatewayName of usecases[usecaseName].gatewayNames) {
      //

      const gatewayNameAsString = gatewayName as string;

      if (!propertyExistsAndHasValue(gateways, gatewayNameAsString)) {
        throw new Error(`'${gatewayNameAsString}' is not exist in application -> usecases -> [${usecaseName}] -> gateways`);
      }

      // jalankan decorator pattern
      let current: BasicFunction = gateways[gatewayNameAsString].gateway!;
      for (const middleware of middlewares) {
        current = middleware("gateway", gateways[gatewayNameAsString].requestType, gatewayNameAsString, current);
      }

      o = { ...o, [gatewayNameAsString]: current };

      // auto transaction detection
      // if gateway if command and found more than one, then the usecase is a command
      if (gateways[gatewayNameAsString].requestType === "command" && requestType !== "command") {
        // modifiedFunctionsCounter += 1;
        // if (modifiedFunctionsCounter > 1) {
        // }
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

    console.log(usecaseName, "=>", requestType);

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
