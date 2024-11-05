import { IsNotEmpty, IsString } from "class-validator";

export class CreateAgendarConsultaDto {
    @IsString()
    @IsNotEmpty({ message: 'Campo obrigatório' })
    prontuario?: string;

    @IsString()
    @IsNotEmpty({ message: 'Campo obrigatório' })
    paciente?: string;

    @IsString()
    @IsNotEmpty({ message: 'Campo obrigatório' })
    tecResponsavel?: string;

    @IsString()
    @IsNotEmpty({ message: 'Campo obrigatório' })
    dataconsulta?: Date;

    @IsString()
    @IsNotEmpty({ message: 'Campo obrigatório' })
    horaconsulta?: string;

    @IsString()
    recorrente?: boolean;
}
