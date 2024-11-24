import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Pagination } from 'src/shared/types/pagination.type';
import { DataSource, EntityNotFoundError, ILike, QueryFailedError, Repository } from 'typeorm';
import { ProfileV2 } from '../profile/entities/profile-v2.entity';
import { AddressV2Dto } from './dto/address-v2.dto';
import { CreateAddressV2Dto } from './dto/create-address-v2.dto';
import { AddressV2FilterDto } from './dto/filter-address.dto';
import { UpdateAddressV2Dto } from './dto/update-address-v2.dto';
import { AddressV2 } from './entities/address-v2.entity';

@Injectable()
export class AddressV2Service {

    constructor(
        @InjectRepository(AddressV2)
        private addressRepository: Repository<AddressV2>,
        private dataSource: DataSource,
    ) { }

    async findAll(filter: AddressV2FilterDto): Promise<Pagination<AddressV2Dto>> {
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

        if (filter.zipcode) {
            where.zipcode = filter.zipcode;
        }

        if (filter.state) {
            where.state = ILike(`%${filter.state}%`);
        }

        if (filter.profileId) {
            where.profile = { id: filter.profileId };
        }

        // if (filter.citizenId) {
        //     where.cidadao = { id: filter.citizenId };
        // }

        const [items, total] = await this.addressRepository.findAndCount({
            // relations: { profile: true, citizen: true },
            relations: { profile: true },
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

    async create({
        zipcode,
        street,
        number,
        neighborhood,
        city,
        state,
        latitude,
        longitude,
        complement,
        profileId,
        citizenId
    }: CreateAddressV2Dto): Promise<AddressV2Dto> {
        if (profileId && citizenId) {
            throw new BadRequestException('Não é possível criar um endereço para usuário e cidadão simultaneamente');
        }

        if (!profileId && !citizenId) {
            throw new BadRequestException('É necessário fornecer profileId ou citizenId');
        }

        try {
            return await this.dataSource.transaction(async (transactionalEntityManager) => {
                const addressRepository = transactionalEntityManager.getRepository(AddressV2);
                const newAddress = addressRepository.create({
                    zipcode,
                    street,
                    number,
                    neighborhood,
                    city,
                    state,
                    latitude,
                    longitude,
                    complement
                });

                if (profileId) {
                    const profileRepository = transactionalEntityManager.getRepository(ProfileV2);
                    const profile = await profileRepository.findOne({
                        relations: { address: true },
                        where: { id: profileId },
                        lock: { mode: 'pessimistic_write' }
                    });

                    if (!profile) {
                        throw new BadRequestException('Usuário não encontrado');
                    }

                    if (profile.address) {
                        throw new BadRequestException('O usuário já possui um endereço associado');
                    }

                    newAddress.profile = profile;
                    await addressRepository.save(newAddress);

                    profile.address = newAddress;
                    await profileRepository.save(profile);

                    delete newAddress.profile;
                }

                // if (citizenId) {
                //     const citizenRepository = transactionalEntityManager.getRepository(Cidadao);
                //     const citizen = await citizenRepository.findOne({
                //         relations: { address: true },
                //         where: { id: citizenId },
                //         lock: { mode: 'pessimistic_write' }
                //     });

                //     if (!citizen) {
                //         throw new BadRequestException('Cidadão não encontrado');
                //     }

                //     if (citizen.address) {
                //         throw new BadRequestException('O cidadão já possui um endereço associado');
                //     }

                //     newAddress.citizen = citizen;
                //     await addressRepository.save(newAddress);

                //     citizen.addressV2 = newAddress;
                //     await citizenRepository.save(citizen);

                //     delete newAddress.citizen;
                // }

                return newAddress.toDto();
            });
        } catch (error) {
            if (error instanceof QueryFailedError) {
                throw new InternalServerErrorException('Falha na operação do banco de dados');
            }
            if (error instanceof EntityNotFoundError) {
                throw new BadRequestException(error.message);
            }
            throw error;
        }
    }

    async update(
        id: string,
        {
            zipcode,
            street,
            number,
            neighborhood,
            city,
            state,
            latitude,
            longitude,
            complement,
            profileId,
            citizenId
        }: UpdateAddressV2Dto
    ): Promise<AddressV2Dto> {
        try {
            return await this.dataSource.transaction(async (transactionalEntityManager) => {
                const addressRepository = transactionalEntityManager.getRepository(AddressV2);
                const addressV2 = await addressRepository.findOne({
                    where: { id },
                    // relations: { profile: true, citizen: true },
                    relations: { profile: true },
                    lock: { mode: 'pessimistic_write' }
                });

                if (!addressV2) {
                    throw new BadRequestException('Endereço não encontrado.');
                }

                if (profileId && citizenId) {
                    throw new BadRequestException('Não é possível associar um endereço a um perfil e a um cidadão simultaneamente.');
                }

                if (profileId) {
                    const profileRepository = transactionalEntityManager.getRepository(ProfileV2);
                    const profile = await profileRepository.findOne({
                        where: { id: profileId },
                        relations: { address: true },
                        lock: { mode: 'pessimistic_write' }
                    });

                    if (!profile) {
                        throw new BadRequestException('Perfil não encontrado.');
                    }

                    if (profile.address && profile.address.id !== id) {
                        throw new BadRequestException('O perfil já possui um endereço associado.');
                    }

                    addressV2.profile = profile;
                }

                // if (citizenId) {
                //     const citizenRepository = transactionalEntityManager.getRepository(Cidadao);
                //     const citizen = await citizenRepository.findOne({
                //         where: { id: citizenId },
                //         relations: { addressV2: true },
                //         lock: { mode: 'pessimistic_write' }
                //     });

                //     if (!citizen) {
                //         throw new BadRequestException('Cidadão não encontrado.');
                //     }

                //     if (citizen.addressV2 && citizen.addressV2.id !== id) {
                //         throw new BadRequestException('O cidadão já possui um endereço associado.');
                //     }

                //     addressV2.citizen = citizen;
                // }

                Object.assign(addressV2, {
                    zipcode,
                    street,
                    number,
                    neighborhood,
                    city,
                    state,
                    latitude,
                    longitude,
                    complement
                });

                await addressRepository.save(addressV2);

                return addressV2.toDto();
            });
        } catch (error) {
            if (error instanceof QueryFailedError) {
                throw new InternalServerErrorException('Falha na operação do banco de dados.');
            }
            if (error instanceof EntityNotFoundError) {
                throw new BadRequestException(error.message);
            }
            throw error;
        }
    }
}
