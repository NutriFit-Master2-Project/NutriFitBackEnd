import { Router } from "express";
const { isEmailAlreadyInDb, findUserByEmail, createUser, fetchAllUsers } = require("../services/authService");
const { registerValidation, loginValidation } = require("../helper/validationJoi");
const { generateAccessToken } = require("../helper/jwtTokenhelper");
const bcrypt = require("bcryptjs");
const verify = require("../helper/verifyToken");

const router = Router();

router.post("/sign-up", async (req, res) => {
    // Validate data before we create a user
    const { error } = registerValidation(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    // Checking if the user is already in the db
    const emailExists = await isEmailAlreadyInDb(req.body.email);
    if (emailExists) return res.status(400).json({ message: "Email already exists" });

    try {
        const userId = await createUser(req.body.name, req.body.email, req.body.password);
        res.status(200).send(`Utilisateur ajouté avec l'ID : ${userId}`);
    } catch (err) {
        res.status(500).json({ message: err });
    }
});

router.post("/sign-in", async (req, res) => {
    try {
        // Validate data before we create a user
        const { error } = loginValidation(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        // Checking if email exist
        const user = await findUserByEmail(req.body.email);
        if (!user) return res.status(400).send("Email doesn't exist");

        // Check if password is correct
        const validPassword = await bcrypt.compare(req.body.password, user.hashedPassword);
        if (!validPassword) return res.status(400).send("Invalid password");

        // Create and assign a token
        const token = await generateAccessToken(user.id, user.name);
        res.header("auth-token", token).send(token);
    } catch (err) {
        res.status(500).send({ message: err?.toString() });
    }
});

router.get("/get-all-users", verify, async (_req, res) => {
    try {
        const users = await fetchAllUsers();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ message: err });
    }
});

module.exports = router;
