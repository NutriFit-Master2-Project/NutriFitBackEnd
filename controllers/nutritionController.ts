import { Router } from "express";
const { fetchProductData, addProductToUser, getProductListForUser } = require("../services/nutritionService");
const verify = require("../helper/verifyToken");

const router = Router();

router.get("/get-nutritional-info/:productId", verify, async (req, res) => {
    const { productId } = req.params;

    try {
        const productData = await fetchProductData(productId);

        if (productData) {
            res.status(200).json(productData);
        } else {
            res.status(404).json({ message: "Produit iconnu" });
        }
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error });
    }
});

router.post("/save-product/:userId", verify, async (req, res) => {
    const { userId } = req.params;
    const body = req.body;

    if (!body) {
        res.status(400).json("Body is needed");
        return;
    }

    try {
        await addProductToUser(userId, body);

        res.status(404).json({ message: "Produit ajouté" });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error });
    }
});

router.get("/product-list/:userId", verify, async (req, res) => {
    const { userId } = req.params;

    try {
        const productList = await getProductListForUser(userId);

        if (productList) {
            res.status(200).json(productList);
        } else {
            res.status(404).json({ message: "Aucun produit trouvé pour l'utilisateur" });
        }
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error });
    }
});

module.exports = router;
