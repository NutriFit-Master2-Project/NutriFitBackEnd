import { UserInfo } from "./userInfo.model";

export interface User {
    id?: string;
    name: string;
    email: string;
    hashedPassword?: string;
}

export interface UserCompleteData extends User, Partial<UserInfo> {}
