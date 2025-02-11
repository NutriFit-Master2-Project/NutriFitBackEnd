import express, { Request, Response } from "express";
const { userDailyEntryService } = require("../services/userDailyEntryService");
const verify = require("../helper/verifyToken");

const router = express.Router();

/**
 * @swagger
 * /api/daily_entries/:userId/entries:
 *   post:
 *     summary: Créer une entrée quotidienne
 *     tags: [Daily Entry]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: L'ID de l'utilisateur
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               calories:
 *                 type: number
 *                 description: Le nombre de calories consommées avec l'alimentation
 *               caloriesBurn:
 *                 type: number
 *                 description: Le nombre de calories brûlées
 *               steps:
 *                 type: number
 *                 description: Le nombre de pas effectués
 *             required:
 *               - calories
 *               - caloriesBurn
 *               - steps
 *     responses:
 *       201:
 *         description: Entrée quotidienne créée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Erreur dans la création de l'entrée
 *       500:
 *         description: Erreur interne du serveur
 */
router.post("/:userId/entries", verify, async (req: Request, res: Response) => {
    const { userId } = req.params;
    const { calories, caloriesBurn, steps } = req.body;
    const date = new Date().toISOString().split("T")[0];

    try {
        const result = await userDailyEntryService.createDailyEntry(userId, date, calories, caloriesBurn, steps);
        res.status(201).json(result);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/daily_entries/:userId/entries:
 *   get:
 *     summary: Récupérer toutes les entrées quotidiennes d'un utilisateur
 *     tags: [Daily Entry]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: L'ID de l'utilisateur
 *     responses:
 *       200:
 *         description: Liste des entrées quotidiennes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   date:
 *                     type: string
 *                     description: La date de l'entrée
 *                   calories:
 *                     type: number
 *                     description: Le nombre de calories consommées
 *                   caloriesBurn:
 *                     type: number
 *                     description: Le nombre de calories brûlées
 *                   steps:
 *                     type: number
 *                     description: Le nombre de pas effectués
 *       500:
 *         description: Erreur interne du serveur
 */
router.get("/:userId/entries", verify, async (req: Request, res: Response) => {
    const { userId } = req.params;

    try {
        const entries = await userDailyEntryService.getDailyEntries(userId);
        res.status(200).json(entries);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/daily_entries/:userId/entries/{date}:
 *   get:
 *     summary: Récupérer une entrée quotidienne spécifique pour une date donnée
 *     tags: [Daily Entry]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: L'ID de l'utilisateur
 *       - in: path
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *         description: La date au format YYYY-MM-DD
 *     responses:
 *       200:
 *         description: Détails de l'entrée quotidienne
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 calories:
 *                   type: number
 *                   description: Le nombre de calories consommées
 *                 caloriesBurn:
 *                   type: number
 *                   description: Le nombre de calories brûlées
 *                 steps:
 *                   type: number
 *                   description: Le nombre de pas effectués
 *       404:
 *         description: Entrée quotidienne non trouvée pour cette date
 */
router.get("/:userId/entries/:date", verify, async (req: Request, res: Response) => {
    const { userId, date } = req.params;

    try {
        const entry = await userDailyEntryService.getDailyEntry(userId, date);
        res.status(200).json(entry);
    } catch (error: any) {
        res.status(404).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/daily_entries/:userId/entries/{date}:
 *   put:
 *     summary: Mettre à jour une entrée quotidienne pour une date donnée
 *     tags: [Daily Entry]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: L'ID de l'utilisateur
 *       - in: path
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *         description: La date de l'entrée
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               calories:
 *                 type: number
 *                 description: Le nombre de calories consommées
 *               caloriesBurn:
 *                 type: number
 *                 description: Le nombre de calories brûlées
 *               steps:
 *                 type: number
 *                 description: Le nombre de pas effectués
 *             required:
 *               - calories
 *               - caloriesBurn
 *               - steps
 *     responses:
 *       200:
 *         description: Entrée quotidienne mise à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Entrée quotidienne non trouvée pour cette date
 */
router.put("/:userId/entries/:date", verify, async (req: Request, res: Response) => {
    const { userId, date } = req.params;
    const data = req.body;

    try {
        const result = await userDailyEntryService.updateDailyEntry(userId, date, data);
        res.status(200).json(result);
    } catch (error: any) {
        res.status(404).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/daily_entries/:userId/entries/{date}:
 *   delete:
 *     summary: Supprimer une entrée quotidienne pour une date donnée
 *     tags: [Daily Entry]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: L'ID de l'utilisateur
 *       - in: path
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *         description: La date de l'entrée
 *     responses:
 *       200:
 *         description: Entrée quotidienne supprimée avec succès
 *       404:
 *         description: Entrée quotidienne non trouvée pour cette date
 */
router.delete("/:userId/entries/:date", verify, async (req: Request, res: Response) => {
    const { userId, date } = req.params;

    try {
        const result = await userDailyEntryService.deleteDailyEntry(userId, date);
        res.status(200).json(result);
    } catch (error: any) {
        res.status(404).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/daily_entries/{userId}/entries/{date}/meals:
 *   post:
 *     summary: Ajouter un aliment à l'entrée quotidienne
 *     tags: [Daily Meals]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: L'ID de l'utilisateur
 *       - in: path
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *         description: La date de l'entrée
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Le nom de l'aliment
 *               calories:
 *                 type: number
 *                 description: Le nombre de calories pour cet aliment
 *               quantity:
 *                 type: number
 *                 description: La quantité de cet aliment consommée
 *               image_url:
 *                 type: string
 *                 description: URL de l'image de l'aliment
 *             required:
 *               - name
 *               - calories
 *               - quantity
 *               - image_url
 *     responses:
 *       201:
 *         description: Aliment ajouté avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Meal added successfully"
 *       400:
 *         description: Erreur dans l'ajout de l'aliment
 *       500:
 *         description: Erreur interne du serveur
 */
router.post("/:userId/entries/:date/meals", verify, async (req: Request, res: Response) => {
    const { userId, date } = req.params;
    const { name, calories, quantity, image_url } = req.body;

    try {
        const result = await userDailyEntryService.addMealToEntry(userId, date, {
            name,
            calories,
            quantity,
            image_url,
            createdAt: new Date(),
        });
        res.status(201).json(result);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/daily_entries/{userId}/entries/{date}/meals:
 *   get:
 *     summary: Obtenir la liste des aliments consommés pour une journée donnée
 *     tags: [Daily Meals]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: L'ID de l'utilisateur
 *       - in: path
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *         description: La date de l'entrée
 *     responses:
 *       200:
 *         description: Liste des aliments consommés
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                   calories:
 *                     type: number
 *                   quantity:
 *                     type: number
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *       500:
 *         description: Erreur interne du serveur
 */
router.get("/:userId/entries/:date/meals", verify, async (req: Request, res: Response) => {
    const { userId, date } = req.params;

    try {
        const meals = await userDailyEntryService.getMealsForEntry(userId, date);
        res.status(200).json(meals);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/daily_entries/{userId}/entries/{date}/meals/{mealId}:
 *   delete:
 *     summary: Supprimer un aliment spécifique de l'entrée quotidienne
 *     tags: [Daily Meals]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: L'ID de l'utilisateur
 *       - in: path
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *         description: La date de l'entrée
 *       - in: path
 *         name: mealId
 *         required: true
 *         schema:
 *           type: string
 *         description: L'ID de l'aliment à supprimer
 *     responses:
 *       200:
 *         description: Aliment supprimé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Meal deleted successfully"
 *       404:
 *         description: Aliment non trouvé pour cette entrée quotidienne
 */
router.delete("/:userId/entries/:date/meals/:mealId", verify, async (req: Request, res: Response) => {
    const { userId, date, mealId } = req.params;

    try {
        const result = await userDailyEntryService.deleteMeal(userId, date, mealId);
        res.status(200).json(result);
    } catch (error: any) {
        res.status(404).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/daily_entries/:userId/entries/:date/add-calories-burn:
 *   post:
 *     summary: Ajouter des calories brûlées à l'entrée quotidienne
 *     tags: [Daily Entry]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: L'ID de l'utilisateur
 *       - in: path
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *         description: La date de l'entrée au format YYYY-MM-DD
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               caloriesBurnToAdd:
 *                 type: number
 *                 description: Le nombre de calories brûlées à ajouter
 *             required:
 *               - caloriesBurnToAdd
 *     responses:
 *       200:
 *         description: Calories brûlées ajoutées avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Erreur dans l'ajout des calories brûlées
 *       500:
 *         description: Erreur interne du serveur
 */
router.post("/:userId/entries/:date/add-calories-burn", verify, async (req: Request, res: Response) => {
    const { userId, date } = req.params;
    const { caloriesBurnToAdd } = req.body;

    try {
        const result = await userDailyEntryService.addCaloriesBurn(userId, date, caloriesBurnToAdd);
        res.status(200).json(result);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
