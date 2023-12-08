import cors from "cors";
import dotenv from "dotenv";
import express from "express";

import { DataSource } from "typeorm";
import { controllerCollection } from "./app/controller/_controller.js";
import { constructDeclarativeController, middlewareContextWithTraceId, printController } from "./framework/controller_express.js";
import { Middleware, bootstrap, createController } from "./framework/core.js";
import { transactionMiddleware } from "./framework/gateway_typeorm.js";
import { recordingInit, recordingMiddleware, setDescriptionRecording } from "./plugin/recording/recording.js";

import swaggerUi from "swagger-ui-express";
import { handleAuthorization, handleError } from "./app/controller/_middleware.js";
import { undeterministicFunctions } from "./app/controller/_undeterministic.js";
import { gateways } from "./app/gateway/_gateway.js";
import { usecaseCollections } from "./app/usecases/_usecase.js";
import { controllerToOpenAPI } from "./plugin/swagger/controller_to_openapi.js";
import { groupingControllerWithTag } from "./plugin/controller_ui/group_controller.js";
import { constructGraph } from "./plugin/graph/graph.js";

export const main = async () => {
  //

  dotenv.config();

  const isDevMode = true;

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

    const frameworkMiddleware = [];
    {
      if (isDevMode) {
        frameworkMiddleware.push(recordingMiddleware());

        // sample how to create middleware
        const middlewareSample: Middleware = (funcType, requestType, name, inport) => {
          return async (ctx, input) => {
            setDescriptionRecording(ctx, "omar");
            return await inport(ctx, input);
          };
        };
        frameworkMiddleware.push(middlewareSample);
      }
    }

    const helloRouter = express.Router();

    const helloController = (router: express.Router) => {
      return createController([], (x) => {
        //
        helloRouter.get("/hello", (req, res) => res.json({ message: "helloworld" }));
      });
    };

    const mainRouter = express.Router();

    const controllers = [
      //
      ...controllerCollection.map((httpData) => constructDeclarativeController(mainRouter, httpData, undeterministicFunctions)),
      helloController(helloRouter),
    ];

    const usecaseWithGatewayInstance = bootstrap(
      //
      gateways(ds),
      usecaseCollections,
      controllers,
      transactionMiddleware(ds),
      frameworkMiddleware
    );

    const app = express();
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cors({ exposedHeaders: ["TraceId", "Date"] }));

    if (isDevMode) {
      // RECORDING
      app.use("/recording", recordingInit(ds, usecaseWithGatewayInstance));

      // GRAPH
      app.use("/graph", constructGraph(usecaseWithGatewayInstance));

      // CONTROLLER_UI
      app.use("/controllers", groupingControllerWithTag(controllerCollection));

      // OPEN_API
      const openApiObj = controllerToOpenAPI(controllerCollection);
      app.use("/openapi", (req, res) => res.json(openApiObj));

      // SWAGGER_UI
      app.use("/swagger", swaggerUi.serve, swaggerUi.setup(openApiObj));
      // app.use("/redocly", redocly());
    }

    app.use(middlewareContextWithTraceId());
    app.use(handleAuthorization());
    app.use(mainRouter);

    app.use(handleError());

    printController(controllerCollection);

    console.log("graph url      :", "http://localhost:3000/graph");
    console.log("controller url :", "http://localhost:3000/controllers");
    console.log("swagger url    :", "http://localhost:3000/swagger");
    console.log("openapi url    :", "http://localhost:3000/openapi");

    await ds.initialize();

    app.listen(3000, () => console.log("server is running"));

    //
  } catch (error: any) {
    console.log(error.message);

    throw error;
  }

  //
};

main();

// recording_ui
// {
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// const distPath = path.join(__dirname, "plugin/recording/dist");
// app.get("/recording/ui", (req, res) => res.sendFile(path.join(distPath, "index.html")));
// app.use("/assets", express.static(path.join(distPath, "assets")));
// }
