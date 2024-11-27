import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPagination } from 'src/shared/types/pagination.type';
import { DataSource, EntityNotFoundError, ILike, QueryFailedError, Repository } from 'typeorm';
import { ProfileV2 } from '../profile/entities/profile-v2.entity';
import { Vendor } from '../vendor/entities/vendor.entity';
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


    async findOne(id: string): Promise<AddressV2Dto> {
        const address = await this.addressRepository.findOne({
            where: { id },
            relations: ['profile'],
        });

        if (!address) {
            throw new BadRequestException(`Endereço com ID ${id} não encontrado`);
        }

        return address.toDto();
    }

    async findAll(filter: AddressV2FilterDto): Promise<IPagination<AddressV2Dto>> {
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
            relations: { profile: true, vendor: true },
            where,
            take: limit,
            skip: skip,
            order: {
                street: 'ASC'
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

    async create(dto: CreateAddressV2Dto): Promise<AddressV2Dto> {
        if (dto.profileId && dto.citizenId && dto.vendorId) {
            throw new BadRequestException('Não é possível criar um endereço simultaneamente');
        }

        if (!dto.profileId && !dto.citizenId && !dto.vendorId) {
            throw new BadRequestException('É necessário fornecer uma referência como ID');
        }

        try {
            return await this.dataSource.transaction(async (manager) => {
                const addressRepository = manager.getRepository(AddressV2);
                const newAddress = addressRepository.create({
                    zipcode: dto.zipcode,
                    street: dto.street,
                    number: dto.number,
                    neighborhood: dto.neighborhood,
                    city: dto.city,
                    state: dto.state,
                    latitude: dto.latitude,
                    longitude: dto.longitude,
                    complement: dto.complement
                });

                if (dto.profileId) {
                    const profileRepository = manager.getRepository(ProfileV2);
                    const profile = await profileRepository.findOne({
                        relations: { address: true },
                        where: { id: dto.profileId }
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

                if (dto.vendorId) {
                    const vendorRepository = manager.getRepository(Vendor);
                    const vendor = await vendorRepository.findOne({
                        relations: { address: true },
                        where: { id: dto.vendorId }
                    });

                    if (!vendor) {
                        throw new BadRequestException('Fornecedor não encontrado.');
                    }

                    if (vendor.address) {
                        throw new BadRequestException('O fornecedor já possui um endereço associado.');
                    }

                    newAddress.vendor = vendor;
                    await addressRepository.save(newAddress);

                    vendor.address = newAddress;
                    await vendorRepository.save(vendor);

                    delete newAddress.vendor;
                }

                // if (citizenId) {
                //     const citizenRepository = manager.getRepository(Cidadao);
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
                throw new BadRequestException('Falha na operação do banco de dados');
            }
            if (error instanceof EntityNotFoundError) {
                throw new BadRequestException(error.message);
            }
            throw new BadRequestException(error);
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
            return await this.dataSource.transaction(async (manager) => {
                const addressRepository = manager.getRepository(AddressV2);
                const addressV2 = await addressRepository.findOne({
                    where: { id },
                    // relations: { profile: true, citizen: true },
                    relations: { profile: true, vendor: true },
                });

                if (!addressV2) {
                    throw new BadRequestException('Endereço não encontrado.');
                }

                if (profileId && citizenId) {
                    throw new BadRequestException('Não é possível associar um endereço a um perfil e a um cidadão simultaneamente.');
                }

                if (profileId) {
                    const profileRepository = manager.getRepository(ProfileV2);
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
                //     const citizenRepository = manager.getRepository(Cidadao);
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
