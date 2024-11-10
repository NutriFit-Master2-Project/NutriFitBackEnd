import { Router } from "express";
const {
    fetchProductData,
    addProductToUser,
    getProductListForUser,
    deleteProductFromUser,
} = require("../services/nutritionService");
const verify = require("../helper/verifyToken");

const router = Router();

/**
 * @swagger
 * /api/nutrition/get-nutritional-info/{productId}:
 *   get:
 *     summary: Obtenir les informations nutritionnelles d'un produit
 *     tags: [Nutrition]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: L'ID du produit
 *     responses:
 *       200:
 *         description: Informations nutritionnelles du produit
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 product_name:
 *                   type: string
 *                   description: Nom du produit
 *                 ingredients_text:
 *                   type: string
 *                   description: Liste des ingrédients du produit
 *                 nutriments:
 *                   type: object
 *                   properties:
 *                     energy:
 *                       type: number
 *                       description: Énergie en kj
 *                     energy-kcal:
 *                       type: number
 *                       description: Énergie en kcal
 *                     fat:
 *                       type: number
 *                       description: Quantité de graisses en g
 *                     saturated-fat:
 *                       type: number
 *                       description: Quantité de graisses saturées en g
 *                     sugars:
 *                       type: number
 *                       description: Quantité de sucres en g
 *                     salt:
 *                       type: number
 *                       description: Quantité de sel en g
 *                     proteins:
 *                       type: number
 *                       description: Quantité de protéines en g
 *                 ingredients_analysis_tags:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: Tags d'analyse des ingrédients (ex. végétarien, végan)
 *                 nutriscore_grade:
 *                   type: string
 *                   description: Nutri-score du produit (a, b, c, d, e)
 *                 brands:
 *                   type: string
 *                   description: Marque du produit
 *                 categories:
 *                   type: string
 *                   description: Catégories du produit
 *                 quantity:
 *                   type: string
 *                   description: Quantité du produit
 *                 labels:
 *                   type: string
 *                   description: Labels associés au produit (ex. bio)
 *                 allergens:
 *                   type: string
 *                   description: Allergènes présents dans le produit
 *                 image_url:
 *                   type: string
 *                   description: URL de l'image du produit
 *       404:
 *         description: Produit inconnu
 *       500:
 *         description: Erreur serveur
 */
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

/**
 * @swagger
 * /api/nutrition/save-product/{userId}:
 *   post:
 *     summary: Enregistrer un produit pour un utilisateur
 *     tags: [Nutrition]
 *     security:
 *       - bearerAuth: []
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
 *               product_name:
 *                 type: string
 *                 description: Nom du produit
 *               ingredients_text:
 *                 type: string
 *                 description: Liste des ingrédients du produit
 *               nutriments:
 *                 type: object
 *                 properties:
 *                   energy:
 *                     type: number
 *                     description: Énergie en kj
 *                   energy-kcal:
 *                     type: number
 *                     description: Énergie en kcal
 *                   fat:
 *                     type: number
 *                     description: Quantité de graisses en g
 *                   saturated-fat:
 *                     type: number
 *                     description: Quantité de graisses saturées en g
 *                   sugars:
 *                     type: number
 *                     description: Quantité de sucres en g
 *                   salt:
 *                     type: number
 *                     description: Quantité de sel en g
 *                   proteins:
 *                     type: number
 *                     description: Quantité de protéines en g
 *               ingredients_analysis_tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Tags d'analyse des ingrédients (ex. végétarien, végan)
 *               nutriscore_grade:
 *                 type: string
 *                 description: Nutri-score du produit (a, b, c, d, e)
 *               brands:
 *                 type: string
 *                 description: Marque du produit
 *               categories:
 *                 type: string
 *                 description: Catégories du produit
 *               quantity:
 *                 type: string
 *                 description: Quantité du produit
 *               labels:
 *                 type: string
 *                 description: Labels associés au produit (ex. bio)
 *               allergens:
 *                 type: string
 *                 description: Allergènes présents dans le produit
 *               image_url:
 *                 type: string
 *                 description: URL de l'image du produit
 *     responses:
 *       200:
 *         description: Produit ajouté avec succès
 *       400:
 *         description: Le body de la requête est requis
 *       500:
 *         description: Erreur serveur
 */
router.post("/save-product/:userId", verify, async (req, res) => {
    const { userId } = req.params;
    const body = req.body;

    if (!body) {
        res.status(400).json("Body is needed");
        return;
    }

    try {
        await addProductToUser(userId, body);

        res.status(200).json({ message: "Produit ajouté" });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error });
    }
});

/**
 * @swagger
 * /api/nutrition/product-list/{userId}:
 *   get:
 *     summary: Récupère la liste des produits associés à un utilisateur
 *     tags: [Nutrition]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'utilisateur pour lequel récupérer la liste des produits
 *     responses:
 *       200:
 *         description: Liste des produits de l'utilisateur
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   product_name:
 *                     type: string
 *                     description: Nom du produit
 *                   ingredients_text:
 *                     type: string
 *                     description: Description des ingrédients
 *                   nutriments:
 *                     type: object
 *                     properties:
 *                       energy:
 *                         type: number
 *                         description: Énergie en kj
 *                       energy-kcal:
 *                         type: number
 *                         description: Énergie en kcal
 *                       fat:
 *                         type: number
 *                         description: Quantité de graisses en g
 *                       saturated-fat:
 *                         type: number
 *                         description: Quantité de graisses saturées en g
 *                       sugars:
 *                         type: number
 *                         description: Quantité de sucres en g
 *                       salt:
 *                         type: number
 *                         description: Quantité de sel en g
 *                       proteins:
 *                         type: number
 *                         description: Quantité de protéines en g
 *                   ingredients_analysis_tags:
 *                     type: array
 *                     items:
 *                       type: string
 *                     description: Tags d'analyse des ingrédients
 *                   nutriscore_grade:
 *                     type: string
 *                     description: Nutri-score du produit (a, b, c, d, e)
 *                   brands:
 *                     type: string
 *                     description: Marque du produit
 *                   categories:
 *                     type: string
 *                     description: Catégories du produit
 *                   quantity:
 *                     type: string
 *                     description: Quantité du produit
 *                   labels:
 *                     type: string
 *                     description: Labels associés au produit
 *                   allergens:
 *                     type: string
 *                     description: Allergènes présents dans le produit
 *                   image_url:
 *                     type: string
 *                     description: URL de l'image du produit
 *       404:
 *         description: Aucun produit trouvé pour l'utilisateur
 *       500:
 *         description: Erreur serveur
 */
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

/**
 * @swagger
 * /api/nutrition/product/{userId}/{productId}:
 *   delete:
 *     summary: Supprime un produit spécifique pour un utilisateur
 *     tags: [Nutrition]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'utilisateur
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du produit à supprimer
 *     responses:
 *       200:
 *         description: Produit supprimé avec succès
 *       404:
 *         description: Produit non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.delete("/product/:userId/:productId", verify, async (req, res) => {
    const { userId, productId } = req.params;

    try {
        await deleteProductFromUser(userId, productId);
        res.status(200).json({ message: "Produit supprimé avec succès" });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error });
    }
});

module.exports = router;
