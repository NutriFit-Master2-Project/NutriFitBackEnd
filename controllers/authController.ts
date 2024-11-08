import { Router } from "express";
const { isEmailAlreadyInDb, findUserByEmail, createUser, fetchAllUsers } = require("../services/authService");
const { registerValidation, loginValidation } = require("../helper/validationJoi");
const { generateAccessToken } = require("../helper/jwtTokenhelper");
const bcrypt = require("bcryptjs");
const verify = require("../helper/verifyToken");

const router = Router();

/**
 * @swagger
 * /api/auth/sign-up:
 *   post:
 *     summary: Inscrire un nouvel utilisateur
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Utilisateur créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Validation échouée ou email déjà utilisé
 *       500:
 *         description: Erreur serveur
 */
router.post("/sign-up", async (req, res) => {
    // Validate data before we create a user
    const { error } = registerValidation(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    // Checking if the user is already in the db
    const emailExists = await isEmailAlreadyInDb(req.body.email);
    if (emailExists) return res.status(400).json({ message: "Email already exists" });

    try {
        const userId = await createUser(req.body.name, req.body.email, req.body.password);
        res.status(200).json({ message: `Utilisateur ajouté avec l'ID : ${userId}` });
    } catch (err) {
        res.status(500).json({ message: err });
    }
});

/**
 * @swagger
 * /api/auth/sign-in:
 *   post:
 *     summary: Connecter un utilisateur
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Authentification réussie
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       400:
 *         description: Email ou mot de passe incorrect
 *       500:
 *         description: Erreur serveur
 */
router.post("/sign-in", async (req, res) => {
    try {
        // Validate data before we create a user
        const { error } = loginValidation(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });

        // Checking if email exist
        const user = await findUserByEmail(req.body.email);
        if (!user) return res.status(400).json({ message: "Email doesn't exist" });

        // Check if password is correct
        const validPassword = await bcrypt.compare(req.body.password, user.hashedPassword);
        if (!validPassword) return res.status(400).json({ message: "Invalid password" });

        // Create and assign a token
        const token = await generateAccessToken(user.id, user.name);
        res.header("auth-token", token).json({ token });
    } catch (err) {
        res.status(500).json({ message: err?.toString() });
    }
});

/**
 * @swagger
 * /api/auth/get-all-users:
 *   get:
 *     summary: Récupérer tous les utilisateurs
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste de tous les utilisateurs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   email:
 *                     type: string
 *                     format: email
 *       500:
 *         description: Erreur serveur
 */
router.get("/get-all-users", verify, async (_req, res) => {
    try {
        const users = await fetchAllUsers();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ message: err });
    }
});

module.exports = router;
