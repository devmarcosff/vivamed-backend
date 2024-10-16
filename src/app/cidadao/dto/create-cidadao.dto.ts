import { IsBoolean, IsDate, IsString } from "class-validator";

export class CreateCidadaoDto {
    // @IsString()
    // // @IsNotEmpty({ message: 'Campo obrigatório' })
    // prontuario: string;

    // @IsString()
    // // @IsNotEmpty({ message: 'Campo obrigatório' })
    // nome: string;

    // @IsString()
    // // @IsNotEmpty({ message: 'Campo obrigatório' })
    // frequencia: string;

    // @IsString()
    // // @IsNotEmpty({ message: 'Campo obrigatório' })
    // cpf: string;

    // @IsDate()
    // // @IsNotEmpty({ message: 'Campo obrigatório' })
    // birthday: Date;

    // @IsNumber()
    // caps: boolean;

    // @IsNumber()
    // password: string;
    @IsString()
    nome: string;

    @IsDate()
    nascimento: Date;

    @IsString()
    mae: string;

    @IsString()
    prontuario: string;

    @IsString()
    cpf: string;

    @IsString()
    inicioTratamento: string;

    @IsString()
    escolaridade: string;

    @IsString()
    pai: string;

    @IsString()
    conjuge: string;

    @IsString()
    cns: string;

    @IsString()
    telContato: string;

    @IsString()
    cor: string;

    @IsString()
    genero: string;

    @IsString()
    motivoAcolhimento: string;

    @IsString()
    servicoEncaminhado: string;

    @IsString()
    drogas: string;

    @IsString()
    doenca: string;

    @IsString()
    usaMedicacao: string;

    @IsString()
    alergiaMedicamento: string;

    @IsString()
    cid: string;

    @IsString()
    familiaVuneravel: string;

    @IsString()
    beneficioSocial: string;

    @IsString()
    condutaImediata: string;

    @IsString()
    tecResponsavel: string;

    @IsString()
    frequencia: string;

    @IsBoolean()
    caps: boolean;

    @IsString()
    password: string;
}
