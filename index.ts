import express, { Express, Request, Response, Application } from "express";
import dotenv from "dotenv";
const authRouter = require("./controllers/authController");
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

app.listen(port, () => {
    console.log(`Server is Fire at http://localhost:${port}`);
});
