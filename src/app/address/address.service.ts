import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Pagination } from 'src/shared/types/pagination.type';
import { DataSource, EntityNotFoundError, ILike, QueryFailedError, Repository } from 'typeorm';
import { Cidadao } from '../cidadao/entities/cidadao.entity';
import { User } from '../user/entities/user.entity';
import { AddressDto } from './dto/address.dto';
import { CreateAddressDto } from './dto/create-address.dto';
import { AddressFilterDto } from './dto/filter-address.dto';
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
        private cidadaoRepository: Repository<Cidadao>,
        private dataSource: DataSource,
    ) { }

    async create({ userId, cep, city, state, street }: CreateAddressDto) {
        const bdUser = await this.userRepository.findOne({
            relations: { address: true },
            where: {
                cpf: userId
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

    async createAddressCidadao({ userId, cep, city, state, street, num }: CreateAddressDto) {
        const bdCidadao = await this.cidadaoRepository.findOne({
            relations: { address: true },
            where: {
                prontuario: userId
            }
        })
        if (!bdCidadao) throw new NotFoundException(`O usuário com o cpf ${userId} não identificado`)
        if (bdCidadao.address) throw new NotFoundException('Já existe um endereço cadastrado para este usuário.')

        const newAddress = await this.addressRepository.create({ cep, city, state, street, num });
        newAddress.cidadao = bdCidadao;
        bdCidadao.address = newAddress;

        await this.addressRepository.save(newAddress)
        await this.cidadaoRepository.save(bdCidadao)

        newAddress.cidadao = undefined;

        return newAddress;
    }

    async findAllAddress() {
        const bdAddress = await this.addressRepository.find();

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

    async findAllAddressV2(filter: AddressFilterDto): Promise<Pagination<AddressDto>> {
        const where: any = {};
        const page = filter.page || 1;
        const limit = filter.limit || 10;
        const skip = (page - 1) * limit;

        if (filter.street) {
            where.street = ILike(`%${filter.street}%`);
        }
        if (filter.city) {
            where.city = ILike(`%${filter.city}%`);
        }
        if (filter.cep) {
            where.cep = filter.cep;
        }
        if (filter.state) {
            where.state = ILike(`%${filter.state}%`);
        }

        if (filter.userId) {
            where.user = { id: filter.userId };
        }
        if (filter.citizenId) {
            where.cidadao = { id: filter.citizenId };
        }

        const [items, total] = await this.addressRepository.findAndCount({
            relations: { user: true, cidadao: true },
            where,
            take: limit,
            skip: skip,
            order: {
                id: 'DESC'
            }
        });

        const addressDtos = items.map(address => address.toDto());

        return {
            items: addressDtos,
            info: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        };
    }

    async createV2({
        cep,
        city,
        state,
        street,
        num,
        userId,
        citizenId
    }: CreateAddressDto): Promise<AddressDto> {
        if (userId && citizenId) {
            throw new BadRequestException('Não é possível criar um endereço para usuário e cidadão simultaneamente');
        }

        if (!userId && !citizenId) {
            throw new BadRequestException('É necessário fornecer userId ou citizenId');
        }

        try {
            return await this.dataSource.transaction(async (transactionalEntityManager) => {
                const addressRepository = transactionalEntityManager.getRepository(Address);
                const newAddress = addressRepository.create({ cep, city, state, street, num });

                if (userId) {
                    const userRepository = transactionalEntityManager.getRepository(User);
                    const user = await userRepository.findOne({
                        relations: { address: true },
                        where: { id: userId },
                        lock: { mode: 'pessimistic_write' }
                    });

                    if (!user) {
                        throw new NotFoundException('Usuário não encontrado');
                    }

                    if (user.address) {
                        throw new ConflictException('O usuário já possui um endereço associado');
                    }

                    newAddress.user = user;
                    await addressRepository.save(newAddress);

                    user.address = newAddress;
                    await userRepository.save(user);

                    delete newAddress.user;
                } else {
                    const citizenRepository = transactionalEntityManager.getRepository(Cidadao);
                    const citizen = await citizenRepository.findOne({
                        relations: { address: true },
                        where: { id: citizenId },
                        lock: { mode: 'pessimistic_write' }
                    });

                    if (!citizen) {
                        throw new NotFoundException('Cidadão não encontrado');
                    }

                    if (citizen.address) {
                        throw new ConflictException('O cidadão já possui um endereço associado');
                    }

                    newAddress.cidadao = citizen;
                    await addressRepository.save(newAddress);

                    citizen.address = newAddress;
                    await citizenRepository.save(citizen);

                    delete newAddress.cidadao;
                }

                return newAddress.toDto();
            });
        } catch (error) {
            if (error instanceof QueryFailedError) {
                throw new InternalServerErrorException('Falha na operação do banco de dados');
            }
            if (error instanceof EntityNotFoundError) {
                throw new NotFoundException(error.message);
            }
            throw error;
        }
    }
}
