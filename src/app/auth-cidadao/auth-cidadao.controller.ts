import { Body, Controller, Post } from '@nestjs/common';
import { AuthCidadaoService } from './auth-cidadao.service';
import { CreateAuthCidadaoDto } from './dto/create-auth-cidadao.dto';

@Controller('auth-cidadao')
export class AuthCidadaoController {
  constructor(private readonly authCidadaoService: AuthCidadaoService) { }

  @Post()
  create(@Body() createAuthCidadaoDto: CreateAuthCidadaoDto) {
    return this.authCidadaoService.create(createAuthCidadaoDto);
  }
}
