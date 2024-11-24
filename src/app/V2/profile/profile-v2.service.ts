import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AddressV2 } from '../address/entities/address-v2.entity';
import { UpdateProfileV2Dto } from './dto/update-profile-v2.dto';
import { ProfileV2 } from './entities/profile-v2.entity';

@Injectable()
export class ProfileV2Service {
    constructor(
        @InjectRepository(ProfileV2)
        private profileRepository: Repository<ProfileV2>,
        @InjectRepository(AddressV2)
        private addressRepository: Repository<AddressV2>,
    ) { }

    async update(id: string, updateProfileDto: UpdateProfileV2Dto) {
        const profileDb = await this.profileRepository.findOne({
            where: { id: id },
            relations: ['address']
        });

        if (!profileDb) {
            throw new BadRequestException('Perfil não encontrado');
        }

        Object.assign(profileDb, updateProfileDto);

        if (updateProfileDto.address) {
            if (profileDb.address) {
                Object.assign(profileDb.address, updateProfileDto.address);
            } else {
                profileDb.address = this.addressRepository.create(updateProfileDto.address);
            }
        }

        return this.profileRepository.save(profileDb);
    }
}
