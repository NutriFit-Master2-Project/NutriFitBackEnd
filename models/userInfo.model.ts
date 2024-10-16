export interface UserInfo {
    id: string;
    age: number;
    weight: number;
    size: number;
    genre: boolean;
    activites: "SEDENTARY" | "ACTIVE" | "SPORTIVE";
    calories?: number
    objective: "WEIGHTGAIN" | "WEIGHTLOSS"
}
