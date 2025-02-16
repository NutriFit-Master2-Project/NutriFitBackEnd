import { Router } from "express";
const { Mistral } = require('@mistralai/mistralai');
const { mapToDishinfo } = require("../services/dishService");
const verify = require("../helper/verifyToken");

const router = Router();

router.post('/recommend-dish', verify, async (req, res) => {
    const { aliments } = req.body;

    try {
        const apiKey = process.env.API_KEY_MISTRAL_AI;
        const client = new Mistral({ apiKey: apiKey });

        const chatResponse = await client.agents.complete({
            agentId: "ag:bba70181:20250216:nutrifit-dish:86f253d2",
            messages: [{ role: 'user', content: "aliments : "+ aliments }],
            max_tokens: 5000,
            response_format: { type: "json_object" },
          });
        
        const dishInfo = await mapToDishinfo(chatResponse.choices[0].message.content);
        
        res.status(200).json(dishInfo);
    } catch (error) {
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
});

module.exports = router;