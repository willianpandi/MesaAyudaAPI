import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  ParseUUIDPipe,
  UnauthorizedException,
  Put,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto, UpdateUserPassword, UserDto } from './dto/user.dto';
import { ApiTags } from '@nestjs/swagger';

import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from './entities/user.entity';
import { Auth } from '../auth/decorators/auth.decorator';
import { ROLES } from '../constants/opcions';

@ApiTags('Usuarios')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('create')
  @Auth(ROLES.SOPORTE, ROLES.ADMINISTRADOR)
  async create(@Body() body: UserDto) {
    return await this.usersService.createUser(body);
  }

  @Get('all')
  @Auth(ROLES.SOPORTE, ROLES.ADMINISTRADOR)
  async findAll() {
    return await this.usersService.findAllUsers();
  }

  @Get('all/soportes')
  @Auth(ROLES.USUARIO, ROLES.SOPORTE, ROLES.ADMINISTRADOR)
  async findSoporte(@GetUser() user: User) {
    return await this.usersService.findSoporteUsers(user);
  }

  //CONTADOR

  @Get('count')
  async getCount() {
    return await this.usersService.Count();
  }

  @Get(':id')
  @Auth(ROLES.SOPORTE, ROLES.ADMINISTRADOR)
  async findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.usersService.findOneUser(id);
  }

  @Patch('edit/:id')
  @Auth(ROLES.USUARIO, ROLES.SOPORTE, ROLES.ADMINISTRADOR)
  async update(
    @GetUser() user: User,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() body: UpdateUserDto,
  ) {
    return await this.usersService.updateUser(id, body, user);
  }

  @Put('password')
  @Auth(ROLES.USUARIO, ROLES.SOPORTE, ROLES.ADMINISTRADOR)
  async updatePassword(
    @GetUser() user: User,
    @Body() body: UpdateUserPassword,
  ) {
    return await this.usersService.updatePassword(user, body);
  }

  @Delete('delete/:id')
  @Auth(ROLES.SOPORTE, ROLES.ADMINISTRADOR)
  async remove(
    @GetUser() user: User,
    @Param('id', new ParseUUIDPipe()) id: number,
  ) {
    return await this.usersService.removeUser(id);
  }
}
