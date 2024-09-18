import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cidadao } from '../cidadao/entities/cidadao.entity';
import { User } from '../user/entities/user.entity';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { Address } from './entities/address.entity';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Address)
    private addressRepository: Repository<Address>,
    @InjectRepository(Cidadao)
    private cidadaoRepository: Repository<Cidadao>
  ) { }

  async create({ userId, cep, city, state, street }: CreateAddressDto) {
    const bdUser = await this.userRepository.findOne({
      relations: { address: true },
      where: {
        id: userId
      }
    })
    if (!bdUser) throw new NotFoundException(`O usuário com o cpf ${userId} não foi identificado`)
    if (bdUser.address) throw new NotFoundException('Já existe um endereço cadastrado para este usuário.')

    const newAddress = await this.addressRepository.create({ cep, city, state, street });
    newAddress.user = bdUser;
    bdUser.address = newAddress;

    await this.addressRepository.save(newAddress)
    await this.userRepository.save(bdUser)

    newAddress.user = undefined;

    return newAddress;
  }

  async createAddressCidadao({ userId, cep, city, state, street }: CreateAddressDto) {
    const bdCidadao = await this.cidadaoRepository.findOne({
      relations: { address: true },
      where: {
        id: userId
      }
    })
    if (!bdCidadao) throw new NotFoundException(`O usuário com o cpf ${userId} não identificado`)
    if (bdCidadao.address) throw new NotFoundException('Já existe um endereço cadastrado para este usuário.')

    const newAddress = await this.addressRepository.create({ cep, city, state, street });
    newAddress.cidadao = bdCidadao;
    bdCidadao.address = newAddress;

    await this.addressRepository.save(newAddress)
    await this.cidadaoRepository.save(bdCidadao)

    newAddress.cidadao = undefined;

    return newAddress;
  }

  async findAllAddress() {
    const bdAddress = await this.addressRepository.find();

    // return bdAddress.map(address => {
    //   const { id, ...result } = address;
    //   return result
    // })

    return bdAddress;
  }

  async findOneAddress(id) {
    const oneAddress = await this.addressRepository.findOne({ where: { id: id } });

    if (!oneAddress) throw new NotFoundException(`Não há endereço vinculado ao usuário.`)

    return oneAddress;
  }

  async update(id: number, updateAddressDto: UpdateAddressDto) {
    const addressById = await this.addressRepository.findOne({ where: { id: id } })
    if (!addressById) throw new NotFoundException(`Endereço não identificado.`)

    this.addressRepository.update(addressById.id, updateAddressDto)

    return `Produto atualizado com sucesso.`;
  }

  async remove(id: number) {
    const addressById = await this.addressRepository.findOne({ where: { id: id } })
    if (!addressById) throw new NotFoundException(`Endereço não identificado.`)

    await this.addressRepository.delete({ id });

    return `Endereço excluído com sucesso.`;
  }
}
