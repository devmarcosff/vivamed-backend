import { PartialType } from '@nestjs/mapped-types';
import { CreateAuthCidadaoDto } from './create-auth-cidadao.dto';

export class UpdateAuthCidadaoDto extends PartialType(CreateAuthCidadaoDto) {}
