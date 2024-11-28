import { PaginationParamsDto } from "src/shared/dto/pagination-params.dto";

export class FirmFilterDto extends PaginationParamsDto {
    businessName?: string;
    fantasyName?: string;
    cnpj?: string;
    phone?: string;
    email?: string;
    stateRegistration?: string;
    municipalRegistration?: string;
}
