import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import routes from "./routes";
import configurations from "./configurations/configurations";
import { connectDb } from "./db/database";
import { errorHandler } from "./middleware/error-handler.middleware";
import { Request, Response } from "express";

import { setupSwagger } from './swagger'; // Import the Swagger setup
import userRoutes from './routes/user.routes';

//Getting the  configurations
const CONFIG = configurations();

//Call to the database connection
connectDb();

//Initialize the express app
const app = express();

// Initialize Swagger
setupSwagger(app);

//Initialize the CORS
const corsOptions = {
  origin: [`${CONFIG.APP.clientUrl}`],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Authorization", "Content-Type", "Accept"],
};

// Initialize the CORS middleware with options
app.use(cors(corsOptions));

//Use this body parser initializations after the webhook. Because webhook accepting raw body data
//Initialize the body parser request size limitations
app.use(bodyParser.json({ limit: "100mb" }));
app.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));

//Accepting the requests body data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Setting up the base route
app.use(`/${CONFIG.APP.globalPrefix}`, routes);

//Handling the errors
app.use(errorHandler);

//Listen to the PORT
app.listen(CONFIG.APP.port, () => {
  console.log(`Server started on PORT : ${CONFIG.APP.port}`);
});
