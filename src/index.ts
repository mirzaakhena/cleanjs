import express from "express";
import dotenv from "dotenv";
import path from "path";

import { DataSource } from "typeorm";
import { controllerCollection, controllers } from "./app/controller/_controller.js";
import { bootstrap } from "./framework/core.js";
import { middlewareContext, printRouteToConsole } from "./framework/controller_express.js";
import { transactionMiddleware } from "./framework/gateway_typeorm.js";
import { recordingInit, recordingMiddleware } from "./plugin/recording/recording.js";

import { gateways } from "./app/gateway/_gateway.js";
import { usecases } from "./app/usecases/_usecase.js";
import { handleError, handleUser } from "./app/controller/_middleware.js";
import { controllerToOpenAPI } from "./plugin/swagger/middleware_swagger-ui.js";
import { fileURLToPath } from "url";
import swaggerUi from "swagger-ui-express";
import { redocly } from "./plugin/swagger/middleware_redocly.js";

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
    });

    const mainRouter = express.Router();

    const frameworkMiddleware = [];
    {
      isDevMode && frameworkMiddleware.push(recordingMiddleware());
      frameworkMiddleware.push(transactionMiddleware(ds));
    }

    const usecaseWithGatewayInstance = bootstrap(gateways(ds), usecases, controllers(mainRouter), frameworkMiddleware);

    const recordingRouter = express.Router();

    const app = express();
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
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

    const openApiObj = controllerToOpenAPI(controllerCollection);
    isDevMode && app.use("/openapi", (req, res) => res.json(openApiObj));
    isDevMode && app.use("/swagger", swaggerUi.serve, swaggerUi.setup(openApiObj));

    printRouteToConsole("", mainRouter);
    console.log("swagger url", "http://localhost:3000/swagger");
    console.log("opnapi url ", "http://localhost:3000/openapi");

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
