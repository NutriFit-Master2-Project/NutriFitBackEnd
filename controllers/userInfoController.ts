import { Router } from "express";
const { userInfoProfile, calculateCalories } = require("../services/userInfoService");
const verify = require("../helper/verifyToken");

const router = Router();

router.put("/user-info", /*verify,*/async (req, res) => {
    try {
        const { id, age, weight, size, genre, activites, objective} = req.body;

        if (!id || age == null || weight == null || size == null || genre == null || !activites || !objective) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const isUpdated = await userInfoProfile(id, age, weight, size, genre, activites);
        const bmr = await calculateCalories(id, weight, size, age, genre, activites, objective);

        if (isUpdated & bmr) {
            return res.status(200).json({ message: "User info updated successfully" });
        } else {
            return res.status(500).json({ message: "Failed to update user info" });
        }
    } catch (err: any) {
        return res.status(500).json({ message: err.message });
    }
});

module.exports = router;