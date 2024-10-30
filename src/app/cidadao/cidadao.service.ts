import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { CreateCidadaoDto } from './dto/create-cidadao.dto';
import { UpdateCidadaoDto } from './dto/update-cidadao.dto';
import { Cidadao } from './entities/cidadao.entity';

@Injectable()
export class CidadaoService {
  constructor(
    @InjectRepository(Cidadao)
    private cidadaoRepository: Repository<Cidadao>
  ) { }

  async create(createCidadaoDto: CreateCidadaoDto) {
    const isCidadaoCpf = await this.cidadaoRepository.existsBy({ cpf: createCidadaoDto.cpf })
    const isCidadaoProntuario = await this.cidadaoRepository.existsBy({ prontuario: createCidadaoDto.prontuario })
    if (!!isCidadaoCpf) throw new NotFoundException(`Cidadão já está cadastrado.`)
    if (!!isCidadaoProntuario) throw new NotFoundException(`Cidadão já está cadastrado.`)
    // if (!!isCidadaoCpf) return 'Cidadão já está cadastrado.';
    // if (!!isCidadaoProntuario) return 'Cidadão já está cadastrado.';

    const saltOrRounds = 10;
    const hash = await bcrypt.hash(createCidadaoDto.password, saltOrRounds);

    const novoCidadao = {
      createAt: new Date(),
      nome: createCidadaoDto.nome,
      nascimento: createCidadaoDto.nascimento,
      mae: createCidadaoDto.mae,
      pai: createCidadaoDto.pai,
      prontuario: createCidadaoDto.prontuario,
      cpf: createCidadaoDto.cpf,
      inicioTratamento: createCidadaoDto.inicioTratamento,
      escolaridade: createCidadaoDto.escolaridade,
      conjuge: createCidadaoDto.conjuge,
      cns: createCidadaoDto.cns,
      telContato: createCidadaoDto.telContato,
      cor: createCidadaoDto.cor,
      genero: createCidadaoDto.genero,
      motivoAcolhimento: createCidadaoDto.motivoAcolhimento,
      servicoEncaminhado: createCidadaoDto.servicoEncaminhado,
      drogas: createCidadaoDto.drogas,
      doenca: createCidadaoDto.doenca,
      usaMedicacao: createCidadaoDto.usaMedicacao,
      alergiaMedicamento: createCidadaoDto.alergiaMedicamento,
      cid: createCidadaoDto.cid,
      familiaVuneravel: createCidadaoDto.familiaVuneravel,
      beneficioSocial: createCidadaoDto.beneficioSocial,
      condutaImediata: createCidadaoDto.condutaImediata,
      tecResponsavel: createCidadaoDto.tecResponsavel,
      frequencia: createCidadaoDto.frequencia,
      caps: createCidadaoDto.caps,
      password: hash
    } as Cidadao

    await this.cidadaoRepository.save(novoCidadao);

    novoCidadao.password = undefined;
    return 'Usuário cadastrado com sucesso.'
  }

  async findAll() {
    const cidadoes = await this.cidadaoRepository.find({ relations: { consultas: true, address: true } });

    return cidadoes.map(user => {
      const { password, ...result } = user;
      return result
    })
  }

  async findByProntuario(prontuario: any) {
    const cidadoes = await this.cidadaoRepository.findOne({ where: { id: prontuario }, relations: { consultas: true } });

    if (!cidadoes) throw new NotFoundException(`Prontuário ${prontuario} não encontrado.`)

    const { password, ...result } = cidadoes;
    return result;
  }

  async update(prontuario: any, updateCidadaoDto: UpdateCidadaoDto) {
    const cidadoes = await this.cidadaoRepository.findOne({ where: { prontuario } });
    if (!cidadoes) throw new NotFoundException(`Prontuário ${prontuario} não encontrado.`)

    this.cidadaoRepository.update(cidadoes.id, updateCidadaoDto);

    return `Usuário atualizado com sucesso`
  }

  async remove(prontuario: any) {
    const cidadoes = await this.cidadaoRepository.findOne({ where: { prontuario } });
    if (!cidadoes) throw new NotFoundException(`Prontuário ${prontuario} não encontrado.`)

    this.cidadaoRepository.delete({ prontuario });

    return `Usuário deletado com sucesso.`
  }
}