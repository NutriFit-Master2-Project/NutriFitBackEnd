import { Router } from "express";
const { userInfoProfile, calculateCalories, getUserInfoProfile } = require("../services/userInfoService");
const verify = require("../helper/verifyToken");

const router = Router();

/**
 * @swagger
 * /api/user-info:
 *   put:
 *     summary: Mettre à jour les informations de l'utilisateur
 *     tags: [User Info]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 description: L'ID unique de l'utilisateur
 *               age:
 *                 type: integer
 *                 description: L'âge de l'utilisateur en années
 *               weight:
 *                 type: number
 *                 description: Le poids de l'utilisateur en kilogrammes
 *               size:
 *                 type: number
 *                 description: La taille de l'utilisateur en centimètres
 *               genre:
 *                 type: boolean
 *                 description: Le genre de l'utilisateur, true pour homme et false pour femme
 *               activites:
 *                 type: string
 *                 enum: [SEDENTARY, ACTIVE, SPORTIVE]
 *                 description: Le niveau d'activité de l'utilisateur
 *               objective:
 *                 type: string
 *                 enum: [WEIGHTGAIN, WEIGHTLOSS]
 *                 description: L'objectif de poids de l'utilisateur (gain ou perte de poids)
 *             required:
 *               - id
 *               - age
 *               - weight
 *               - size
 *               - genre
 *               - activites
 *               - objective
 *     responses:
 *       200:
 *         description: Informations de l'utilisateur mises à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Tous les champs sont requis
 *       500:
 *         description: Échec de la mise à jour des informations de l'utilisateur
 */
router.put("/user-info", verify, async (req, res) => {
    try {
        const { id, age, weight, size, genre, activites, objective } = req.body;

        if (!id || age == null || weight == null || size == null || genre == null || !activites || !objective) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const isUpdated = await userInfoProfile(id, age, weight, size, genre, activites, objective);
        const bmr = await calculateCalories(id, weight, size, age, genre, activites, objective);

        if (isUpdated && bmr) {
            return res.status(200).json({ message: "User info updated successfully" });
        } else {
            return res.status(500).json({ message: "Failed to update user info" });
        }
    } catch (err: any) {
        return res.status(500).json({ message: err.message });
    }
});

/**
 * @swagger
 * /api/user-info/{userId}:
 *   get:
 *     summary: Obtenir les informations complètes de l'utilisateur
 *     tags: [User Info]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: L'ID de l'utilisateur
 *     responses:
 *       200:
 *         description: Informations complètes de l'utilisateur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *                   format: email
 *                 age:
 *                   type: integer
 *                 weight:
 *                   type: number
 *                 size:
 *                   type: number
 *                 genre:
 *                   type: boolean
 *                 activites:
 *                   type: string
 *                   enum: [SEDENTARY, ACTIVE, SPORTIVE]
 *                 calories:
 *                   type: number
 *                 objective:
 *                   type: string
 *                   enum: [WEIGHTGAIN, WEIGHTLOSS]
 *       404:
 *         description: Utilisateur inconnu
 *       500:
 *         description: Erreur serveur
 */
router.get("/user-info/:userId", verify, async (req, res) => {
    try {
        const { userId } = req.params;

        const userData = await getUserInfoProfile(userId);

        if (!userData) {
            res.status(404).json({ message: "Unknown user" });
            return;
        }

        return res.status(200).json(userData);
    } catch (err: any) {
        return res.status(500).json({ message: err.message });
    }
});

module.exports = router;
