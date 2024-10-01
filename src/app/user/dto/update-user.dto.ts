import { PartialType } from '@nestjs/mapped-types';
import { IsDate, IsOptional, IsString } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    @IsString() @IsOptional()
    name?: string;

    @IsDate() @IsOptional()
    birthday?: Date;

    @IsDate() @IsOptional()
    active?: Date;

    @IsString() @IsOptional()
    username?: string;

    @IsString() @IsOptional()
    password?: string;
}
