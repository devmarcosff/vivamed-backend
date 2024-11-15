import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateFornecedorDto } from './dto/create-fornecedor.dto';
import { UpdateFornecedorDto } from './dto/update-fornecedor.dto';
import { Fornecedor } from './entities/fornecedor.entity';

@Injectable()
export class FornecedorService {
  constructor(
    @InjectRepository(Fornecedor)
    private fornecedorRepository: Repository<Fornecedor>
  ) { }

  async create(createFornecedorDto: CreateFornecedorDto) {
    const isFornecedores = await this.fornecedorRepository.findOne({ where: { cnpj: createFornecedorDto.cnpj } });
    if (isFornecedores) throw new NotFoundException(`CNPJ ${isFornecedores.cnpj} já cadastrado para ${isFornecedores.nome}`);

    const novoFornecedor = {
      createAt: new Date(),
      nome: createFornecedorDto.nome,
      cnpj: createFornecedorDto.cnpj,
      email: createFornecedorDto.email,
      contato: createFornecedorDto.contato
    } as Fornecedor

    await this.fornecedorRepository.save(novoFornecedor)

    return 'Fornecedor cadastrado com sucesso.'
  }

  async findAll() {
    const isFornecedores = await this.fornecedorRepository.find({ order: { createAt: 'ASC' }, relations: { address: true } });
    return isFornecedores.find(e => e.softDelete == false) ? isFornecedores : `Nenhum fornecedor encontrado`
  }

  async findOne(cnpj: string) {
    const isFornecedores = await this.fornecedorRepository.findOne({ where: { cnpj } });
    if (!isFornecedores) throw new NotFoundException(`O fornecedor com o CNPJ ${cnpj} não foi identificado.`);

    return isFornecedores;
  }

  async update(cnpj: string, updateFornecedorDto: UpdateFornecedorDto) {
    const isFornecedores = await this.fornecedorRepository.findOne({ where: { cnpj } });
    if (!isFornecedores) throw new NotFoundException(`O fornecedor com o CNPJ ${cnpj} não foi identificado.`);
    this.fornecedorRepository.update(isFornecedores.id, updateFornecedorDto);

    return `Usuário atualizado com sucesso`
  }

  async remove(cnpj: string, updateFornecedorDto: UpdateFornecedorDto) {
    const isFornecedores = await this.fornecedorRepository.findOne({ where: { cnpj } });
    if (!isFornecedores) throw new NotFoundException(`O fornecedor com o CNPJ ${cnpj} não foi identificado.`);
    this.fornecedorRepository.update(isFornecedores.id, updateFornecedorDto);

    return `Usuário deletado com sucesso`
  }

  async removeFornecedor(cnpj: string) {
    const isFornecedores = await this.fornecedorRepository.findOne({ where: { cnpj } });
    if (!isFornecedores) throw new NotFoundException(`O fornecedor com o CNPJ ${cnpj} não foi identificado.`);
    this.fornecedorRepository.remove(isFornecedores);

    return `Usuário deletado com sucesso`
  }
}
