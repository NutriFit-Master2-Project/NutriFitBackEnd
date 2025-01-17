const jwt = require("jsonwebtoken");
import dotenv from "dotenv";

dotenv.config();

const generateAccessToken = async (userId: string, userName: string) => {
    return jwt.sign({ userId, userName }, process.env.TOKEN_SECRET, { expiresIn: "3h" });
};

module.exports.generateAccessToken = generateAccessToken;
