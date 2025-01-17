const firebaseDb = require("../config/firebaseConfig");
import { Training } from "../models/training.model";

const addTraining = async (training: Training): Promise<{ id: string; training: Training }> => {
    const trainingRef = firebaseDb.collection("trainings");
    const trainingDoc = await trainingRef.add(training);
    return { id: trainingDoc.id, training };
};
const calculateTotalCalories = (training: Training): number => {
    return training.exercises.reduce((total, exercise) => total + exercise.calories, 0);
};
const getTrainings = async (): Promise<(Training & { id: string; totalCalories: number })[]> => {
    const trainingsSnapshot = await firebaseDb.collection("trainings").get();
    const trainings: (Training & { id: string; totalCalories: number })[] = [];
    trainingsSnapshot.forEach((doc: any) => {
        const training = doc.data() as Training;
        trainings.push({ id: doc.id, totalCalories: calculateTotalCalories(training), ...training });
    });
    return trainings;
};

const deleteTraining = async (trainingId: string): Promise<void> => {
    await firebaseDb.collection("trainings").doc(trainingId).delete();
};

const getTrainingsByType = async (
    type: "WEIGHTLOSS" | "WEIGHTGAIN"
): Promise<(Training & { id: string; totalCalories: number })[]> => {
    const trainingsSnapshot = await firebaseDb.collection("trainings").where("type", "==", type).get();
    const trainings: (Training & { id: string; totalCalories: number })[] = [];
    trainingsSnapshot.forEach((doc: any) => {
        const training = doc.data() as Training;
        trainings.push({ id: doc.id, totalCalories: calculateTotalCalories(training), ...training });
    });
    return trainings;
};

module.exports = {
    addTraining,
    getTrainings,
    deleteTraining,
    getTrainingsByType,
};
