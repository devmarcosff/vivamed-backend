import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    @IsString() @IsOptional()
    firstName?: string;

    @IsString() @IsOptional()
    lastName?: string;

    @IsDate() @IsOptional()
    birthday?: Date;

    @IsString() @IsOptional()
    username?: string;

    @IsString() @IsOptional()
    password?: string;
}
