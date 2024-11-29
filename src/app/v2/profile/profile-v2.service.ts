import {
    BadRequestException,
    Injectable,
    NotFoundException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { UserV2 } from '../user/entities/user-v2.entity';
import { CreateProfileV2Dto } from './dto/create-profile-v2.dto';
import { ProfileV2Dto } from './dto/profile-v2.dto';
import { UpdateProfileV2Dto } from './dto/update-profile-v2.dto';
import { ProfileV2 } from './entities/profile-v2.entity';

@Injectable()
export class ProfileV2Service {
    constructor(
        @InjectRepository(ProfileV2)
        private profileRepository: Repository<ProfileV2>,
        private dataSource: DataSource,
    ) { }

    async create(dto: CreateProfileV2Dto): Promise<ProfileV2Dto> {
        return this.dataSource.transaction(async (manager) => {
            const profileRepository = manager.getRepository(ProfileV2);
            const userRepository = manager.getRepository(UserV2);

            const userDb = await userRepository.findOne({
                relations: { profile: true },
                where: { id: dto.userId }
            });

            if (!userDb) {
                throw new NotFoundException('User not found.');
            }

            if (userDb && userDb.profile) {
                return userDb.profile.toDto();
            }

            const newProfile = profileRepository.create({
                name: dto.name,
                birthday: dto.birthday,
                picture: dto.picture,
                user: userDb
            });

            var profileDb = await profileRepository.save(newProfile);

            return profileDb.toDto();
        });
    }

    async findById(id: string): Promise<ProfileV2Dto> {
        const profile = await this.profileRepository.findOne({
            where: { id, enabled: true },
            relations: ['address'],
        });

        if (!profile) {
            throw new NotFoundException('Perfil não encontrado');
        }

        return profile.toDto();
    }

    async update(id: string, dto: UpdateProfileV2Dto): Promise<ProfileV2Dto> {
        return this.dataSource.transaction(async (manager) => {
            const profileRepository = manager.getRepository(ProfileV2);

            const profileDb = await profileRepository.findOne({
                where: { id, enabled: true },
                lock: { mode: 'pessimistic_write' },
            });

            if (!profileDb) {
                throw new BadRequestException('Perfil não encontrado');
            }

            Object.assign(profileDb, dto);

            await profileRepository.update(id, profileDb);

            return profileDb.toDto();
        });
    }

}
