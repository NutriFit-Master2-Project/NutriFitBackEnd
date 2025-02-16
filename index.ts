import express, { Express, Request, Response, Application } from "express";
import dotenv from "dotenv";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const authRouter = require("./controllers/authController");
const userInfoRouter = require("./controllers/userInfoController");
const nutritionRouter = require("./controllers/nutritionController");
const userDailyEntryRouter = require("./controllers/userDailyEntryController");
const trainingRouter = require("./controllers/trainingController");
const dishRouter = require("./controllers/dishController");
const cors = require("cors");

dotenv.config();

const app: Application = express();
const port = process.env.PORT || 8000;

app.use(express.json());
app.use(cors());

const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "NutriFit API",
            version: "1.0.0",
            description: "Documentation de l'API NutriFit",
        },
        servers: [{ url: `http://localhost:${port}` }],
    },
    apis: ["./controllers/*.ts"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.get("/", (req: Request, res: Response) => {
    res.send("Welcome to NutriFit Back-End !");
});

app.use("/api/auth", authRouter);
app.use("/api", userInfoRouter);
app.use("/api/nutrition", nutritionRouter);
app.use("/api/daily_entries", userDailyEntryRouter);
app.use("/api", trainingRouter);
app.use("/api", dishRouter);

app.listen(port, () => {
    console.log(`Server is Fire at http://localhost:${port}`);
});
