import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { Pagination } from 'src/shared/types/pagination.type';
import { AuthV2Guard } from '../auth/auth-v2.guard';
import { CreateUserV2Dto } from './dto/create-user-v2.dto';
import { UserV2FilterDto } from './dto/filter-user-v2.dto';
import { UserV2Dto } from './dto/user-v2.dto';
import { UserV2Service } from './user-v2.service';

@ApiBearerAuth()
@ApiTags('User')
@UseGuards(AuthV2Guard)
@Controller('v2/user')
export class UserV2Controller {
    constructor(private readonly userV2Service: UserV2Service) { }

    @Post()
    @ApiOperation({ summary: "Create a user", description: "Creates a new user." })
    @ApiCreatedResponse({ description: "User created successfully." })
    @ApiUnauthorizedResponse({ description: "Unauthorized access." })
    create(@Body() dto: CreateUserV2Dto) {
        return this.userV2Service.create(dto);
    }

    @Get()
    @ApiOperation({ summary: "User filter", description: "Fetches all users." })
    @ApiOkResponse({ description: "Users retrieved successfully." })
    @ApiUnauthorizedResponse({ description: "Unauthorized access." })
    async findAll(@Query() dto: UserV2FilterDto): Promise<Pagination<UserV2Dto>> {
        return this.userV2Service.findAll(dto);
    }

    @Get(':id')
    @ApiOperation({ summary: "Fetch a user", description: "Fetches a user by ID." })
    @ApiOkResponse({ description: "User retrieved successfully." })
    @ApiUnauthorizedResponse({ description: "Unauthorized access." })
    findOne(@Param('id') id: string) {
        return this.userV2Service.findOne(id);
    }
}
