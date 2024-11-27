import { PaginationParamsDto } from "src/shared/dto/pagination-params.dto";

export class VendorFilterDto extends PaginationParamsDto {
    businessName?: string;
    tradeName?: string;
    cnpj?: string;
    phone?: string;
    email?: string;
    stateRegistration?: string;
    municipalRegistration?: string;
}
