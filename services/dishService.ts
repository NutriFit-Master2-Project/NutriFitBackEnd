import { DishInfo } from "../models/dish.model";
const firebaseDb = require("../config/firebaseConfig");

const mapToDishinfo = async (response: any) =>{
    const content = response.choices[0].message.content;

    const DishInfo: DishInfo = {
        id: content.id || '',
        Name: content.Name || '',
        Description: content.Description || '',
        Food: content.Food || [],
        ExtraFood: content.ExtraFood || [],
        PreparationStep: content.PreparationStep || [],
        CookTime: content.CookTime || ''
    }
    return DishInfo;
}

module.exports = {
    mapToDishinfo
};
