import { PartialType } from '@nestjs/swagger';
import { CreateProfileV2Dto } from './create-profile-v2.dto';

export class UpdateProfileV2Dto extends PartialType(CreateProfileV2Dto) {}
