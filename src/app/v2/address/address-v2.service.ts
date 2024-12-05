import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
    NotFoundException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPagination } from 'src/shared/types/pagination.type';
import { DataSource, EntityNotFoundError, ILike, QueryFailedError, Repository } from 'typeorm';
import { Firm } from '../firm/entities/firm.entity';
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

    async create(dto: CreateAddressV2Dto): Promise<AddressV2Dto> {
        if (dto.profileId && dto.citizenId && dto.firmId) {
            throw new BadRequestException('Cannot create an address simultaneously for multiple entities.');
        }

        if (!dto.profileId && !dto.citizenId && !dto.firmId) {
            throw new BadRequestException('You must provide a reference ID.');
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
                        throw new BadRequestException('User not found.');
                    }

                    if (profile.address) {
                        throw new BadRequestException('The user already has an associated address.');
                    }

                    newAddress.profile = profile;
                    await addressRepository.save(newAddress);

                    profile.address = newAddress;
                    await profileRepository.save(profile);

                    delete newAddress.profile;
                }

                if (dto.firmId) {
                    const firmRepository = manager.getRepository(Firm);
                    const firm = await firmRepository.findOne({
                        relations: { address: true },
                        where: { id: dto.firmId }
                    });

                    if (!firm) {
                        throw new BadRequestException('Firm not found.');
                    }

                    if (firm.address) {
                        throw new BadRequestException('The firm already has an associated address.');
                    }

                    newAddress.firm = firm;
                    await addressRepository.save(newAddress);

                    firm.address = newAddress;
                    await firmRepository.save(firm);

                    delete newAddress.firm;
                }

                return newAddress.toDto();
            });
        } catch (error) {
            if (error instanceof QueryFailedError) {
                throw new BadRequestException('Database operation failed.');
            }
            if (error instanceof EntityNotFoundError) {
                throw new BadRequestException(error.message);
            }
            throw new BadRequestException(error.message || 'An unexpected error occurred.');
        }
    }

    async findOne(id: string): Promise<AddressV2Dto> {
        const address = await this.addressRepository.findOne({
            where: { id, enabled: true },
            relations: ['profile'],
        });

        if (!address) {
            throw new BadRequestException(`Address with ID ${id} not found.`);
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

        where.enabled = true;

        const [items, total] = await this.addressRepository.findAndCount({
            relations: { profile: true, firm: true },
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
                    relations: { profile: true, firm: true },
                });

                if (!addressV2) {
                    throw new BadRequestException('Address not found.');
                }

                if (profileId && citizenId) {
                    throw new BadRequestException('Cannot associate an address with both a profile and a citizen simultaneously.');
                }

                if (profileId) {
                    const profileRepository = manager.getRepository(ProfileV2);
                    const profile = await profileRepository.findOne({
                        where: { id: profileId },
                        relations: { address: true },
                        lock: { mode: 'pessimistic_write' }
                    });

                    if (!profile) {
                        throw new BadRequestException('Profile not found.');
                    }

                    if (profile.address && profile.address.id !== id) {
                        throw new BadRequestException('The profile already has an associated address.');
                    }

                    addressV2.profile = profile;
                }

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
                throw new InternalServerErrorException('Database operation failed.');
            }
            if (error instanceof EntityNotFoundError) {
                throw new BadRequestException(error.message);
            }
            throw error;
        }
    }

    async remove(id: string): Promise<void> {
        const itemDb = await this.addressRepository.findOne({ where: { id, enabled: true } });
        if (!itemDb) {
            throw new NotFoundException('Address not found.');
        }
        itemDb.enabled = false;
        await this.addressRepository.update(id, itemDb);
    }
}
