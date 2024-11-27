import { PaginationParamsDto } from "src/shared/dto/pagination-params.dto";

export class ReceiptProductFilterDto extends PaginationParamsDto {
    productCode: string;
    description: string;
    ncmCode: string;
    cst: string;
    cfopCode: string;
    unitOfMeasure: string;
    quantity: number;
    unitValue: number;
    totalValue: number;
    bcIcms: number;
    vIcms: number;
    vIpi: number;
    aIcms: number;
    aIpi: number;
}
