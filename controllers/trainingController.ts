/**
 * @swagger
 * tags:
 *   name: Trainings
 *   description: API for managing trainings
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Training:
 *       type: object
 *       required:
 *         - name
 *         - description
 *         - type
 *         - exercises
 *       properties:
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         type:
 *           type: string
 *         exercises:
 *           type: array
 *           items:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - muscles
 *               - series
 *               - repetitions
 *               - calories
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               muscles:
 *                 type: string
 *               series:
 *                 type: number
 *               repetitions:
 *                 type: number
 *               calories:
 *                 type: number
 */

/**
 * @swagger
 * /api/trainings:
 *   post:
 *     summary: Add a new training
 *     tags: [Trainings]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - type
 *               - exercises
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               type:
 *                 type: string
 *               exercises:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - name
 *                     - description
 *                     - muscles
 *                     - series
 *                     - repetitions
 *                     - calories
 *                   properties:
 *                     name:
 *                       type: string
 *                     description:
 *                       type: string
 *                     muscles:
 *                       type: string
 *                     series:
 *                       type: number
 *                     repetitions:
 *                       type: number
 *                     calories:
 *                       type: number
 *     responses:
 *       201:
 *         description: Training added successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Training'
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/trainings:
 *   get:
 *     summary: Get all trainings
 *     tags: [Trainings]
 *     responses:
 *       200:
 *         description: List of trainings
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Training'
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/trainings/{trainingId}:
 *   delete:
 *     summary: Delete a training by ID
 *     tags: [Trainings]
 *     parameters:
 *       - in: path
 *         name: trainingId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the training to delete
 *     responses:
 *       200:
 *         description: Training deleted successfully
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/trainings/type/{type}:
 *   get:
 *     summary: Get trainings by type
 *     tags: [Trainings]
 *     parameters:
 *       - in: path
 *         name: type
 *         schema:
 *           type: string
 *         required: true
 *         description: The type of the trainings to retrieve
 *     responses:
 *       200:
 *         description: List of trainings by type
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Training'
 *       500:
 *         description: Internal server error
 */

import { Request, Response, Router } from "express";
import { Training } from "../models/training.model";
const { addTraining, getTrainings, deleteTraining, getTrainingsByType } = require("../services/trainingService");
const verify = require("../helper/verifyToken");

const router = Router();

router.post("/trainings", verify, async (req: Request, res: Response) => {
    const { name, description, type, exercises }: Training = req.body;

    if (!name || !description || !type || !exercises) {
        return res
            .status(400)
            .json({ error: "Tous les champs (name, description, type, exercises) sont obligatoires." });
    }

    for (const exercise of exercises) {
        if (
            !exercise.name ||
            !exercise.description ||
            !exercise.muscles ||
            !exercise.series ||
            !exercise.repetitions ||
            !exercise.calories
        ) {
            return res.status(400).json({
                error: "Chaque exercice doit inclure name, description, muscles, series, repetitions, et calories.",
            });
        }
    }

    try {
        const result = await addTraining({ name, description, type, exercises });
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de l'ajout de l'entraînement : " + (error as Error).message });
    }
});

router.get("/trainings", verify, async (_req: Request, res: Response) => {
    try {
        const trainings = await getTrainings();
        res.status(200).json(trainings);
    } catch (error) {
        res.status(500).json({
            error: "Erreur lors de la récupération des entraînements : " + (error as Error).message,
        });
    }
});

router.delete("/trainings/:trainingId", verify, async (req: Request, res: Response) => {
    const { trainingId } = req.params;

    try {
        await deleteTraining(trainingId);
        res.status(200).json({ message: "Entraînement supprimé avec succès" });
    } catch (error) {
        res.status(500).json({
            error: "Erreur lors de la suppression de l'entraînement : " + (error as Error).message,
        });
    }
});

router.get("/trainings/type/:type", verify, async (req: Request, res: Response) => {
    const { type } = req.params;

    try {
        const trainings = await getTrainingsByType(type);
        res.status(200).json(trainings);
    } catch (error) {
        res.status(500).json({
            error: "Erreur lors de la récupération des entraînements par type : " + (error as Error).message,
        });
    }
});

module.exports = router;
