import { User } from "../../users/entities/user.entity";

export interface LoginResponse {
    user: User;
    token: string;
}