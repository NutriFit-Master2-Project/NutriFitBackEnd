export interface Exercise {
    name: string;
    description: string;
    muscles: string[];
    series: number;
    repetitions: number;
    calories: number;
    image: string;
}

export interface Training {
    name: string;
    description: string;
    type: "WEIGHTLOSS" | "WEIGHTGAIN";
    exercises: Exercise[];
    totalCalories?: number;
}
