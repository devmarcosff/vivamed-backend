import { Body, Controller, Post } from '@nestjs/common';
import { ApiBadRequestResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post()
    @ApiOperation({ summary: "Login", description: "Entra no sistema com o usuário e a senha." })
    @ApiOkResponse({ description: "Entrou com sucesso" })
    @ApiBadRequestResponse({ description: 'Erro ao veirificar os dados do usuário' })
    signIn(@Body() createAuthDto: CreateAuthDto) {
        return this.authService.signIn(createAuthDto)
    }
}