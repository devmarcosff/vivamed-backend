import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { IPagination } from 'src/shared/types/pagination.type';
import { DataSource, ILike, Repository } from 'typeorm';
import { ProfileV2 } from '../profile/entities/profile-v2.entity';
import { CreateUserV2Dto } from './dto/create-user-v2.dto';
import { UserV2FilterDto } from './dto/filter-user-v2.dto';
import { UserV2Dto } from './dto/user-v2.dto';
import { UserV2 } from './entities/user-v2.entity';

@Injectable()
export class UserV2Service {
    constructor(
        @InjectRepository(UserV2)
        private readonly userRepository: Repository<UserV2>,
        @InjectDataSource()
        private readonly dataSource: DataSource,
    ) { }

    async create(dto: CreateUserV2Dto): Promise<UserV2Dto> {
        return await this.dataSource.transaction(async (manager) => {
            const userRepository = manager.getRepository(UserV2);
            const profileRepository = manager.getRepository(ProfileV2);

            const eCpf = await userRepository.findOne({ where: { cpf: dto.cpf } });
            if (eCpf) {
                throw new BadRequestException('CPF is already in use.');
            }

            const eEmail = await userRepository.findOne({ where: { email: dto.email } });
            if (eEmail) {
                throw new BadRequestException('Email is already registered, please choose a different one.');
            }

            const hashedPassword = await bcrypt.hash(dto.password, 10);

            const newUser = userRepository.create({
                cpf: dto.cpf,
                email: dto.email,
                role: dto.role,
                password: hashedPassword,
            });

            const userDb = await userRepository.save(newUser);

            const newProfile = profileRepository.create({
                name: dto.name,
                user: userDb,
            });

            await profileRepository.save(newProfile);

            return userDb.toDto();
        });
    }

    async findAll(dto: UserV2FilterDto): Promise<IPagination<UserV2Dto>> {
        const where: any = {};
        const page = dto.page || 1;
        const limit = dto.limit || 10;
        const skip = (page - 1) * limit;

        if (dto.name) {
            where.profile = { name: ILike(`%${dto.name}%`) };
        }
        if (dto.email) {
            where.email = ILike(`%${dto.email}%`);
        }
        if (dto.cpf) {
            where.cpf = ILike(`%${dto.cpf}%`);
        }

        const [items, total] = await this.userRepository.findAndCount({
            relations: { profile: { address: true } },
            where,
            take: limit,
            skip: skip,
            order: {
                createdAt: 'ASC',
            },
        });

        const userDtos = items.map((user) => user.toDto());

        return {
            items: userDtos,
            info: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async findOne(id: string): Promise<UserV2Dto> {
        const user = await this.userRepository.findOne({
            where: { id },
            relations: ['profile', 'profile.address'],
        });

        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }

        return user.toDto();
    }

    async remove(id: string): Promise<void> {
        const itemDb = await this.userRepository.findOne({ where: { id, enabled: true } });
        if (!itemDb) {
            throw new NotFoundException('User not found');
        }
        itemDb.enabled = false;
        await this.userRepository.update(id, itemDb);
    }
}
