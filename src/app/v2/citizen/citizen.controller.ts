import { Body, Controller, Post, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthV2Guard } from '../auth/auth-v2.guard';
import { CitizenService } from './citizen.service';

@ApiBearerAuth()
@ApiTags('Citizen')
@UseGuards(AuthV2Guard)
@Controller('v2/citizen')
export class CitizenController {
    constructor(private readonly citizenService: CitizenService) { }

    @Post('import')
    @ApiOperation({ summary: 'Import citizens from XLSX file' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        description: 'XLSX file containing citizen data along with city and district',
        schema: {
            type: 'object',
            properties: {
                city: { type: 'string', description: 'City of residence for the citizens' },
                district: { type: 'string', description: 'District of residence for the citizens' },
                file: { type: 'string', format: 'binary', description: 'XLSX file with citizen data' },
            },
        },
    })
    @UseInterceptors(FileInterceptor('file'))
    async importFromXlsx(
        @Body('city') city: string,
        @Body('district') district: string,
        @Body('updateDuplicates') updateDuplicates: string,
        @UploadedFile() file: Express.Multer.File,
        @Req() req,
    ) {
        const userId = req.user.sub;
        const result = await this.citizenService.importFromXlsx(city, district, file, userId, updateDuplicates.toLowerCase() === "true");

        return {
            message: result.message,
            imported: result.totalImported,
            duplicates: result.totalDuplicated,
            duplicatedCitizens: result.duplicatedCitizens
        };
    }
}
