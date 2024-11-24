import { JwtPayload } from "src/shared/interfaces/jwt.interface";

export interface UserV2JwtPayload extends JwtPayload {
    email?: string;
    cpf?: string;
    role?: string;
}