import { DishInfo } from "../models/dish.model";

const mapToDishinfo = async (responseAI: string): Promise<DishInfo> => {
    try {
        const responseObject = JSON.parse(responseAI);

        const DishInfo: DishInfo = {
            id: responseObject.id ?? "",
            Name: responseObject.Name,
            Description: responseObject.Description,
            Food: responseObject.Food,
            ExtraFood: responseObject.ExtraFood,
            PreparationStep: responseObject.PreparationStep,
            CookTime: responseObject.CookTime
        };

        return DishInfo;
    } catch (error) {
        throw new Error('La réponse n\'est pas un JSON valide');
    }
};

module.exports = {
    mapToDishinfo
};
