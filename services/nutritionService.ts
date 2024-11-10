import axios from "axios";
import { ProductData } from "../models/nutrition.model";
const firebaseDb = require("../config/firebaseConfig");

const fetchProductData = async (productId: string) => {
    const apiUrl = `https://world.openfoodfacts.org/api/v2/product/${productId}.json`;

    try {
        const response = await axios.get(apiUrl);

        const data = response.data;

        if (!data) return null;

        const productData: ProductData = {
            product_name: data.product?.product_name,
            ingredients_text: data.product?.ingredients_text,
            nutriments: {
                energy: data.product?.nutriments.energy,
                "energy-kcal": data.product?.nutriments["energy-kcal"],
                fat: data.product?.nutriments.fat,
                "saturated-fat": data.product?.nutriments["saturated-fat"],
                sugars: data.product?.nutriments?.sugars,
                salt: data.product?.nutriments?.salt,
                proteins: data.product?.nutriments?.proteins,
            },
            ingredients_analysis_tags: data.product?.ingredients_analysis_tags,
            nutriscore_grade: data.product?.nutriscore_grade,
            brands: data.product?.brands,
            categories: data.product?.categories,
            quantity: data.product?.quantity,
            labels: data.product?.labels,
            allergens: data.product?.allergens_tags,
            image_url: data.product?.image_url,
        };

        return productData;
    } catch (error) {
        throw error;
    }
};

const addProductToUser = async (userId: string, productData: ProductData) => {
    try {
        const userRef = firebaseDb.collection("users").doc(userId);
        await userRef.collection("nutritionProducts").add(productData);

        return;
    } catch (error) {
        throw error;
    }
};

const getProductListForUser = async (userId: string): Promise<ProductData[] | null> => {
    try {
        const productsSnapshot = await firebaseDb.collection("users").doc(userId).collection("nutritionProducts").get();

        if (productsSnapshot.empty) {
            return null;
        }

        const products: ProductData[] = [];

        productsSnapshot.forEach((doc: { data: () => ProductData; id: string }) => {
            const productData = doc.data() as ProductData;
            products.push({ ...productData, _id: doc.id });
        });

        return products;
    } catch (error) {
        console.error("Erreur lors de la récupération des produits:", error);
        return null;
    }
};

const deleteProductFromUser = async (userId: string, productId: string): Promise<void> => {
    try {
        const userRef = firebaseDb.collection("users").doc(userId);
        const productRef = userRef.collection("nutritionProducts").doc(productId);
        await productRef.delete();
    } catch (error) {
        throw new Error("Erreur lors de la suppression du produit");
    }
};

module.exports = {
    fetchProductData,
    addProductToUser,
    getProductListForUser,
    deleteProductFromUser,
};
