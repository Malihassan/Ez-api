let express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerJSDoc = require("swagger-jsdoc");
const basicAuth = require('express-basic-auth');

let path = require("path");
let database = require("./helper/database");
let config = require("./config.json");
var bodyParser = require("body-parser");
let cors = require("cors");

database.initModels();
let app = express();
// parse application/x-www-form-urlencoded
// app.use(express.urlencoded({ extended: true }));
app.use(
  express.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 })
);

enableCORS(app);
enableStaticFileServer(app, config.uploadUrl, "/static");
app.use(cors());

// parse application/json
app.use(bodyParser.json({ limit: "50mb" }));
database.connect();

function enableCORS(expressInstance) {
  expressInstance.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization, timeZone"
    );
    res.header(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS, PATCH"
    );
    next();
  });
}

function enableStaticFileServer(expressInstance, folderName, route) {
  app.use(route, express.static(path.join(__dirname, folderName)));
}

require("./routes/index.routes")(app);
const root = path.normalize(`${__dirname}`);

const options = {
  swaggerDefinition: {
    info: {
      title: "Swagger EZ-compliance Project",
      version: "1.0.0",
    },
    basePath: "/api/v1/",
  },
  apis: [path.resolve(`${root}/routes/**/*.js`)],
};

app.use(
  "/api-docs",
  basicAuth({
        users: { "developers": "11111" },
        challenge: true,
      }),
  swaggerUi.serve,
  swaggerUi.setup(swaggerJSDoc(options))
);
app.listen(config.server.port, () => {
  console.log("App listening on port : ", config.server.port);
});
