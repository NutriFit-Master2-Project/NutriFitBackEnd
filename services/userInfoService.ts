import { bool } from "joi";
import { User, UserCompleteData } from "../models/user.model";
import { UserInfo } from "../models/userInfo.model";
const firebaseDb = require("../config/firebaseConfig");

/**
 * Updates the user profile information (age, weight, size, genre, activites)
 * @param id - The id of the user to update
 * @param email - The email of the user to update
 * @param age - The updated age of the user
 * @param weight - The updated weight of the user
 * @param size - The updated size (height) of the user
 * @param genre - The updated gender of the user (true for male, false for female)
 * @param activites - The updated activity level of the user
 * @param objective - The objectif of the user
 * @returns - True if the update was successful, otherwise false
 */
const userInfoProfile = async (
    id: string,
    age: number,
    weight: number,
    size: number,
    genre: boolean,
    activites: "SEDENTARY" | "ACTIVE" | "SPORTIVE",
    objective: "WEIGHTGAIN" | "WEIGHTLOSS"
): Promise<boolean> => {
    try {
        const usersRef = firebaseDb.collection("users").doc(id);
        const snapshot = await usersRef.get();

        if (snapshot.empty) {
            throw new Error("User not found");
        }

        const docRef = await usersRef.update({ age, weight, size, genre, activites, objective });
        return true;
    } catch (error) {
        console.error("Error update info profile:", error);
        return false;
    }
};

/**
 * Calculates the user's Basal Metabolic Rate (BMR) in Kcal/day
 * Formula:
 * MB = (Weight x 10) + (Height x 6.25) - (Age x 5) + (5 if male or -161 if female)
 * Then multiply by 1.37 for sedentary, 1.55 for active, or 1.8 for sporty
 * @param weight - The weight of the user in kilograms
 * @param size - The height of the user in centimeters
 * @param age - The age of the user in years
 * @param genre - The gender of the user (true for male, false for female)
 * @param activites - The activity level of the user ("sedentary", "actif", "sportif")
 * @param objective - The objective level of the user ("weightgain", "weightloss")
 * @returns - The user's BMR in Kcal/day
 */
const calculateCalories = async (
    id: string,
    weight: number,
    size: number,
    age: number,
    genre: boolean,
    activites: "SEDENTARY" | "ACTIVE" | "SPORTIVE",
    objective: "WEIGHTGAIN" | "WEIGHTLOSS"
): Promise<number> => {
    let bmr = weight * 10 + size * 6.25 - age * 5;
    if (genre) {
        bmr -= 161;
    } else {
        bmr += 5;
    }

    // Multiply BMR by activity level
    switch (activites) {
        case "SEDENTARY":
            bmr *= 1.37;
            break;
        case "ACTIVE":
            bmr *= 1.55;
            break;
        case "SPORTIVE":
            bmr *= 1.8;
            break;
        default:
            throw new Error("Invalid activity level");
    }

    switch (objective) {
        case "WEIGHTGAIN":
            bmr += 200;
            break;
        case "WEIGHTLOSS":
            bmr -= 200;
            break;
        default:
            throw new Error("Invalid objective level");
    }
    const calories = bmr;
    await firebaseDb.collection("users").doc(id).update({ calories });
    return bmr;
};

const getUserInfoProfile = async (userId: string): Promise<UserCompleteData | null> => {
    try {
        const usersRef = await firebaseDb.collection("users").doc(userId).get();

        if (!usersRef.exists) {
            return null;
        }

        return usersRef.data();
    } catch (error) {
        throw new Error("Error getting user data");
    }
};

module.exports = {
    userInfoProfile,
    calculateCalories,
    getUserInfoProfile,
};
