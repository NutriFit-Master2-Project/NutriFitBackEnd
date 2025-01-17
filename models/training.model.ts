export interface Exercise {
    name: string;
    description: string;
    muscles: string[];
    series: number;
    repetitions: number;
    calories: number;
}

export interface Training {
    name: string;
    description: string;
    type: "WEIGHTLOSS" | "WEIGHTGAIN";
    exercises: Exercise[];
    totalCalories?: number;
}
