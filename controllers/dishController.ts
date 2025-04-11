/**
 * @swagger
 * tags:
 *   name: Dishes
 *   description: API for dish recommendations
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     DishRequest:
 *       type: object
 *       required:
 *         - aliments
 *       properties:
 *         aliments:
 *           type: array
 *           items:
 *             type: string
 *           example: ["Bœuf haché", "Oignons", "Tomates en conserve", "Haricots rouges", "Maïs", "Fromage cheddar", "Tortillas", "Avocat", "Crème fraîche", "Piments", "Coriandre", "Citron vert"]
 *     DishInfo:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         Name:
 *           type: string
 *         Description:
 *           type: string
 *         Food:
 *           type: array
 *           items:
 *             type: string
 *         ExtraFood:
 *           type: array
 *           items:
 *             type: string
 *         PreparationStep:
 *           type: array
 *           items:
 *             type: string
 *         CookTime:
 *           type: string
 *     CaloriesRequest:
 *       type: object
 *       required:
 *         - Food
 *         - Quantity
 *       properties:
 *         Food:
 *           type: string
 *           example: "blanc de poulet fumé"
 *         Quantity:
 *           type: number
 *           example: 100
 *     CaloriesInfo:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         quantity:
 *           type: number
 *         calories:
 *           type: number
 *         createdAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/recommend-dish:
 *   post:
 *     summary: Get a dish recommendation based on available ingredients
 *     tags: [Dishes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DishRequest'
 *     responses:
 *       200:
 *         description: Dish recommendation retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DishInfo'
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/calories-food:
 *   post:
 *     summary: Get calories information for a specific food and quantity
 *     tags: [Dishes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CaloriesRequest'
 *     responses:
 *       200:
 *         description: Calories information retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CaloriesInfo'
 *       500:
 *         description: Internal server error
 */

import { Router } from "express";
const { Mistral } = require("@mistralai/mistralai");
const { mapToDishinfo } = require("../services/dishService");
const { mapToCaloriesInfo } = require("../services/dishService");
const verify = require("../helper/verifyToken");

const router = Router();

router.post("/recommend-dish", verify, async (req, res) => {
    const { aliments } = req.body;

    try {
        const apiKey = process.env.API_KEY_MISTRAL_AI;
        const client = new Mistral({ apiKey: apiKey });

        const chatResponse = await client.agents.complete({
            agentId: "ag:bba70181:20250216:nutrifit-dish:86f253d2",
            messages: [{ role: "user", content: "aliments : " + aliments }],
            max_tokens: 5000,
            response_format: { type: "json_object" },
        });

        const dishInfo = await mapToDishinfo(chatResponse.choices[0].message.content);

        res.status(200).json(dishInfo);
    } catch (error) {
        res.status(500).json({ error: "Erreur interne du serveur" });
    }
});

router.post("/calories-food", verify, async (req, res) => {
    const { Food, Quantity } = req.body;

    try {
        const apiKey = process.env.API_KEY_MISTRAL_AI;
        const client = new Mistral({ apiKey: apiKey });

        const chatResponse = await client.agents.complete({
            agentId: "ag:bba70181:20250314:nutrifit-dish-calories:1ef5e3ca",
            messages: [{ role: "user", content: `{\"Food\": \"${Food}\", \"Quantity\": ${Quantity}}` }],
            max_tokens: 1000,
            response_format: { type: "json_object" },
        });

        const caloriesFood = await mapToCaloriesInfo(chatResponse.choices[0].message.content);

        res.status(200).json(caloriesFood);
    } catch (error) {
        res.status(500).json({ error: "Erreur interne du serveur" });
    }
});

module.exports = router;
