import { ProfileV2Dto } from "../../profile/dto/profile-v2.dto";

export class UserV2Dto {
    id: string;
    cpf: string;
    email: string;
    role: string;
    profile?: ProfileV2Dto
}