import { JwtPayload } from "src/shared/interfaces/jwt.interface";

export interface UserV2JwtPayload extends JwtPayload {
    profile?: ProfileJwtPayload;
    email?: string;
    cpf?: string;
    role?: string;
}

export interface ProfileJwtPayload {
    name?: string;
}