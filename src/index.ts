import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import path from "path";

import { DataSource } from "typeorm";
import { controllerCollection } from "./app/controller/_controller.js";
import { collectSimpleController, middlewareContext, printController } from "./framework/controller_express.js";
import { Context, Middleware, bootstrap } from "./framework/core.js";
import { transactionMiddleware } from "./framework/gateway_typeorm.js";
import { recordingInit, recordingMiddleware, setDescriptionToContext } from "./plugin/recording/recording.js";

import swaggerUi from "swagger-ui-express";
import { fileURLToPath } from "url";
import { handleError, handleUser } from "./app/controller/_middleware.js";
import { gateways } from "./app/gateway/_gateway.js";
import { usecases } from "./app/usecases/_usecase.js";
import { controllerToOpenAPI } from "./plugin/swagger/middleware_swagger-ui.js";
import { groupingControllerWithTag } from "./plugin/ui/group_controller.js";
import { undeterministicFunctions } from "./app/controller/_undeterministic.js";

export const main = async () => {
  //

  dotenv.config();

  const isDevMode = process.env.APP_MODE === "development";

  try {
    //

    const ds = new DataSource({
      type: "postgres",
      port: 5432,
      host: "localhost",
      username: "root",
      password: "root",
      database: "mydb",
      synchronize: true,
      connectTimeoutMS: 500,
      logging: false,
      entities: [
        //
        "src/app/gateway/gateway_*.ts",
        "src/plugin/recording/recording_typeorm.ts",
      ],
      migrations: ["src/migrations/*.ts"],
    });

    const mainRouter = express.Router();

    const frameworkMiddleware = [];
    {
      isDevMode && frameworkMiddleware.push(recordingMiddleware());
      // sample how to create middleware
      const middlewareSample: Middleware = (funcType, requestType, name, inport) => {
        return async (ctx, input) => {
          setDescriptionToContext(ctx, "omar");
          return await inport(ctx, input);
        };
      };
      isDevMode && frameworkMiddleware.push(middlewareSample);
      frameworkMiddleware.push(transactionMiddleware(ds));
    }

    const controllers = [...collectSimpleController(mainRouter, controllerCollection, undeterministicFunctions)];

    const usecaseWithGatewayInstance = bootstrap(
      //
      gateways(ds),
      usecases,
      controllers,
      frameworkMiddleware
    );

    const recordingRouter = express.Router();

    const app = express();
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cors());
    app.use(middlewareContext());
    app.use(handleUser());
    app.use(mainRouter);

    // recording_ui
    {
      const __filename = fileURLToPath(import.meta.url);
      const __dirname = path.dirname(__filename);
      const distPath = path.join(__dirname, "plugin/recording/dist");

      isDevMode && app.use("/recording", recordingInit(recordingRouter, ds, usecaseWithGatewayInstance));

      app.get("/recording/ui", (req, res) => res.sendFile(path.join(distPath, "index.html")));
      app.use("/assets", express.static(path.join(distPath, "assets")));
    }

    app.use(handleError());

    {
      const openApiObj = controllerToOpenAPI(controllerCollection);
      isDevMode && app.use("/controllers", (req, res) => res.json(groupingControllerWithTag(controllerCollection)));
      isDevMode && app.use("/openapi", (req, res) => res.json(openApiObj));
      isDevMode && app.use("/swagger", swaggerUi.serve, swaggerUi.setup(openApiObj));
      // isDevMode && app.use("/redocly", redocly());
    }

    printController(controllerCollection);

    console.log("controller url :", "http://localhost:3000/controllers");
    console.log("swagger url    :", "http://localhost:3000/swagger");
    console.log("openapi url    :", "http://localhost:3000/openapi");
    // console.log("redocly url ", "http://localhost:3000/redocly");

    await ds.initialize();

    app.listen(3000, () => console.log("server is running"));

    //
  } catch (error: any) {
    console.log(error.message);

    throw error;
  }

  //
};

const experimental = () => {
  //
  //
  //
};

main();
// experimental();
