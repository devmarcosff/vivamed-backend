import { BadRequestException, Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @UseGuards(AuthGuard)
  @Get()
  async findAllUser() {
    return this.userService.findAllUser();
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findById(@Param('id') id: string) {
    return this.userService.findById(id);
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    if (!createUserDto.username || !createUserDto.password) throw new BadRequestException('Usuário ou senha incorreto');
    return this.userService.create(createUserDto);
  }

  @UseGuards(AuthGuard)
  @Patch(':cpf')
  update(@Param('cpf') cpf: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(cpf, updateUserDto);
  }

  @Patch('active/:username')
  updateActive(@Param('username') username: string) {
    return this.userService.updateActive(username);
  }

  @UseGuards(AuthGuard)
  @Delete(':cpf')
  remove(@Param('cpf') cpf: string) {
    return this.userService.remove(cpf);
  }
}