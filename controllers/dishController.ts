import { Router } from "express";
const { Mistral } = require('@mistralai/mistralai');
const { mapToDishinfo } = require("../services/dishService");
const verify = require("../helper/verifyToken");

const router = Router();

router.post('/recommend-dish', verify,async (req, res) => {
    const { fridgeItems } = req.body.message;
    try {
        const apiKey = process.env.API_KEY_MISTRAL_AI;
        const client = new Mistral({ apiKey: apiKey });

        const AgentResponse = await client.agents.complete({
            max_tokens: 10000,
            agent_id: "ag:3996db2b:20240805:french-agent:a8997aab",
            messages: [{ role: 'user', content: fridgeItems }],
            response_format: { "type": "json_object"},
        });
        const dishInfo = mapToDishinfo(AgentResponse);

        res.json(dishInfo);
    } catch (error) {
        console.error('Erreur lors de l\'appel à l\'API Mistral AI:', error);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
});