import { PartialType } from '@nestjs/mapped-types';
import { IsString } from 'class-validator';
import { CreateFornecedorDto } from './create-fornecedor.dto';

export class UpdateFornecedorDto extends PartialType(CreateFornecedorDto) {
    @IsString()
    nome?: string;
    @IsString()
    email?: string;
    @IsString()
    contato?: string;
    @IsString()
    softDelete?: boolean;
}
