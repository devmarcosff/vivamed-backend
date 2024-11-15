import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cidadao } from '../cidadao/entities/cidadao.entity';
import { Fornecedor } from '../fornecedor/entities/fornecedor.entity';
import { User } from '../user/entities/user.entity';
import { CreateAddressDto } from './dto/create-address.dto';
import { Address } from './entities/address.entity';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Address)
    private addressRepository: Repository<Address>,
    @InjectRepository(Fornecedor)
    private fornecedorRepository: Repository<Fornecedor>,
    // private addressRep:ository: Repository<Address>,
    @InjectRepository(Cidadao)
    private cidadaoRepository: Repository<Cidadao>
  ) { }

  // Criar Endereço para o Funcionario
  async create({ userId, cep, city, state, street, num }: CreateAddressDto) {
    // Verifique se o usuário existe
    const isUser = await this.userRepository.findOne({
      where: { cpf: userId },
    });

    console.log('ENDEREÇO DO COLABORADOR')

    if (!isUser) {
      throw new NotFoundException(`O usuário com o CPF ${userId} não foi identificado`);
    }

    // Verifique se o usuário já possui um endereço (opcional, depende do caso de uso)
    const existingAddress = await this.addressRepository.findOne({
      where: { userId: isUser },
    });

    if (existingAddress) {
      throw new ConflictException(`O usuário com o CPF ${userId} já possui um endereço cadastrado`);
    }
    const newAddress = await this.addressRepository.save({
      street,
      city,
      state,
      cep,
      num,
      userId: isUser, // Relacione com o objeto do usuário
    });

    return newAddress;
  }
  // Criar Endereço para o Cidadao CAPS
  async createAddressCidadao({ userId, cep, city, state, street, num }: CreateAddressDto) {
    // Verifique se o usuário existe
    const isUser = await this.cidadaoRepository.findOne({
      where: { cpf: userId },
    });
    console.log('ENDEREÇO DO CIDADÃO CAPS')

    if (!isUser) {
      throw new NotFoundException(`O usuário com o CPF ${userId} não foi identificado`);
    }

    // Verifique se o usuário já possui um endereço (opcional, depende do caso de uso)
    const existingAddress = await this.addressRepository.findOne({
      where: { userId: isUser },
    });

    if (existingAddress) {
      throw new ConflictException(`O usuário com o CPF ${userId} já possui um endereço cadastrado`);
    }
    const newAddress = await this.addressRepository.save({
      street,
      city,
      state,
      cep,
      num,
      userId: isUser, // Relacione com o objeto do usuário
    });

    return newAddress;
  }
  // Criar Endereço para o Fornecedor
  async createAddressFornecedor({ userId, cep, city, state, street, num }: CreateAddressDto) {
    // Verifique se o usuário existe
    const isUser = await this.fornecedorRepository.findOne({
      where: { cnpj: userId },
    });

    console.log('ENDEREÇO DO FORNECEDOR')

    if (!isUser) {
      throw new NotFoundException(`O usuário com o CPF ${userId} não foi identificado`);
    }

    // Verifique se o usuário já possui um endereço (opcional, depende do caso de uso)
    const existingAddress = await this.addressRepository.findOne({
      where: { userId: isUser },
    });

    if (existingAddress) {
      throw new ConflictException(`O usuário com o CPF ${userId} já possui um endereço cadastrado`);
    }
    const newAddress = await this.addressRepository.save({
      createdAt: new Date(),
      street,
      city,
      state,
      cep,
      num,
      userId: isUser, // Relacione com o objeto do usuário
    });

    return newAddress;
  }
  // Listar todos os endereços
  async findAllAddress() {
    const bdAddress = await this.addressRepository.find({ relations: { userId: true } });

    return bdAddress;
  }
  // Listar 1 endereço
  async findOneAddress(id) {
    const oneAddress = await this.addressRepository.findOne({ where: { id: id } });

    if (!oneAddress) throw new NotFoundException(`Não há endereço vinculado ao usuário.`)

    return oneAddress;
  }

  // async update(id: number, updateAddressDto: UpdateAddressDto) {
  //   const addressById = await this.addressRepository.findOne({ where: { id: id } })
  //   if (!addressById) throw new NotFoundException(`Endereço não identificado.`)

  //   this.addressRepository.update(addressById.id, updateAddressDto)

  //   return `Produto atualizado com sucesso.`;
  // }
  // Listar o endereço do ID
  async remove(id: number) {
    const addressById = await this.addressRepository.findOne({ where: { id: id } })
    if (!addressById) throw new NotFoundException(`Endereço não identificado.`)

    await this.addressRepository.delete({ id });

    return `Endereço excluído com sucesso.`;
  }
}
