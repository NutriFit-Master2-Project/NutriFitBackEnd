export interface ProductData {
    product_name: string;
    ingredients_text: string;
    nutriments: {
        energy: number;
        "energy-kcal": number;
        fat: number;
        "saturated-fat": number;
        sugars: number;
        salt: number;
        proteins: number;
    };
    ingredients_analysis_tags: string[];
    nutriscore_grade: string;
    brands: string;
    categories: string;
    quantity: string;
    labels: string;
    allergens: string;
    image_url: string;
}
