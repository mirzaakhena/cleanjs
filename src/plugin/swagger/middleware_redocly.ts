import express from "express";

interface Ioption {
  title: string;
  specUrl: string;
  nonce?: string;
  redocOptions?: object;
}

const html = `<!DOCTYPE html>
<html>
  <head>
    <title>[[title]]</title>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link href="https://fonts.googleapis.com/css?family=Montserrat:300,400,700|Roboto:300,400,700" rel="stylesheet" />
    <style>
      body {
        margin: 0;
        padding: 0;
      }
    </style>
  </head>
  <body>
    <div id="redoc-container"></div>  
    <redoc spec-url="[[spec-url]]"></redoc>
    <script src="https://cdn.redoc.ly/redoc/latest/bundles/redoc.standalone.js"> </script>    
  </body>
</html>`;

const redocHtml = (
  options: Ioption = {
    title: "ReDoc",
    specUrl: "http://petstore.swagger.io/v2/swagger.json",
  }
): string => {
  const { title, specUrl, nonce = "", redocOptions = {} } = options;
  return html //
    .replace("[[title]]", title)
    .replace("[[spec-url]]", specUrl)
    .replace("[[nonce]]", nonce)
    .replace("[[options]]", JSON.stringify(redocOptions));
};

export const redocly = () => {
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    //

    const options: Ioption = {
      title: "ReDoc",
      specUrl: "https://salmongrizzledkeyboard.mirzaakhena.repl.co/json",
      // specUrl: "http://petstore.swagger.io/v2/swagger.json",
    };

    res.type("html");
    res.send(redocHtml(options));

    return next();

    //
  };
};
