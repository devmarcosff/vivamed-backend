import { ProfileV2Dto } from "../../profile/dto/profile-v2.dto";

export class UserV2Dto {
    cpf: string;
    email: string;
    role: string;
    profile?: ProfileV2Dto
}