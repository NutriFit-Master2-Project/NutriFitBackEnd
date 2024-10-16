import express, { Express, Request, Response, Application } from "express";
import dotenv from "dotenv";
const authRouter = require("./controllers/authController");
const userInfoRouter = require("./controllers/userInfoController");
const nutritionRouter = require("./controllers/nutritionController");
const cors = require("cors");

dotenv.config();

const app: Application = express();
const port = process.env.PORT || 8000;

app.use(express.json());
app.use(cors());

app.get("/", (req: Request, res: Response) => {
    res.send("Welcome to NutriFit Back-End !");
});

app.use("/api/auth", authRouter);
app.use("/api", userInfoRouter);
app.use("/api/nutrition", nutritionRouter);

app.listen(port, () => {
    console.log(`Server is Fire at http://localhost:${port}`);
});
