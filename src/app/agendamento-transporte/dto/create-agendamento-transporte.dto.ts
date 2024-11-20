import { IsDate, IsOptional, IsString } from "class-validator";

export class CreateAgendamentoTransporteDto {
    @IsDate()
    @IsOptional()
    dataAgendada?: Date

    @IsString()
    horaAgendada?: string

    @IsString()
    nomePaciente?: string

    @IsString()
    cpfPaciente?: string

    @IsDate()
    @IsOptional()
    dataNascimento?: Date

    @IsString()
    nomeMotorista?: string
}
