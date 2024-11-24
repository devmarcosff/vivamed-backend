import {
    Body,
    Controller,
    Get,
    Param,
    Patch,
    Post,
    UseGuards
} from '@nestjs/common';
import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiOkResponse,
    ApiTags,
    ApiUnauthorizedResponse
} from '@nestjs/swagger';
import { AuthV2Guard } from '../auth/auth-v2.guard';
import { CreateProfileV2Dto } from './dto/create-profile-v2.dto';
import { UpdateProfileV2Dto } from './dto/update-profile-v2.dto';
import { ProfileV2Service } from './profile-v2.service';

@ApiBearerAuth()
@ApiTags('Profile')
@UseGuards(AuthV2Guard)
@Controller('v2/profile')
export class ProfileV2Controller {
    constructor(private readonly profileV2Service: ProfileV2Service) { }

    @Get(':id')
    @ApiOkResponse({ description: "Profile retrieved successfully." })
    @ApiBadRequestResponse({ description: "Profile not found." })
    @ApiUnauthorizedResponse({ description: "Unauthorized access." })
    findById(@Param('id') id: string) {
        return this.profileV2Service.findById(id);
    }

    @Post()
    @ApiOkResponse({ description: "Profile created successfully." })
    @ApiBadRequestResponse({ description: "Error creating profile." })
    @ApiUnauthorizedResponse({ description: "Unauthorized access." })
    create(@Body() dto: CreateProfileV2Dto) {
        return this.profileV2Service.create(dto);
    }

    @Patch(':id')
    @ApiOkResponse({ description: "Profile updated successfully." })
    @ApiBadRequestResponse({ description: "Error retrieving profile." })
    @ApiUnauthorizedResponse({ description: "Unauthorized access." })
    update(@Param('id') id: string, @Body() dto: UpdateProfileV2Dto) {
        return this.profileV2Service.update(id, dto);
    }
}
