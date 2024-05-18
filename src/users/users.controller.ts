import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  ParseUUIDPipe,
  Put,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import {
  AddCategoryDto,
  AddEstableishmentDto,
  UpdateUserDto,
  UpdateUserPassword,
  UserDto,
} from './dto/user.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from './entities/user.entity';
import { Auth } from '../auth/decorators/auth.decorator';
import { ESTADOS, ROLES } from '../constants/opcions';

@ApiTags('Usuarios')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('create')
  @Auth(ROLES.ADMINISTRADOR)
  @ApiResponse({status: 201, description: 'Producto creado correctamente', type: User})
  async create(@Body() body: UserDto) {
    return await this.usersService.createUser(body);
  }

  @Get('all')
  @Auth(ROLES.ADMINISTRADOR)
  async findAll() {
    return await this.usersService.findAllUsers();
  }
  
  @Get('estableishments/:id')
  @Auth(ROLES.SOPORTE, ROLES.ADMINISTRADOR)
  async findEstableishments(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.usersService.findEstableishmentsByUser(id);
  }

  @Get('categories/:id')
  @Auth(ROLES.ADMINISTRADOR)
  async findCategories(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.usersService.findCategoriesByUser(id);
  }
 
  @Get('categories')
  @Auth(ROLES.SOPORTE)
  async findCategoriesAsig( @GetUser() user: User,) {
    return await this.usersService.findCategoriesByUser(user.id);
  }

  @Get('count')
  async getCount() {
    return await this.usersService.Count();
  }

  @Get('supports')
  @Auth(ROLES.ADMINISTRADOR)
  async findSupports() {
    const supports = await this.usersService.findAllUsersSupports();
    const actiSupports = supports.filter(support => support.estado === true);
    return actiSupports;
  }
  
  @Get('newtickets')
  @Auth(ROLES.SOPORTE)
  async findNewTickets(
    @GetUser() user: User,
  ) {
    const tickets = await this.usersService.findTicketsByUser(user.id, 'DESC')
    const newTickets = tickets.filter(ticket => ticket.estado === ESTADOS.ABIERTO || ticket.estado === ESTADOS.EN_PROCESO);
    return newTickets;
  }
  
  @Get('closetickets')
  @Auth(ROLES.SOPORTE)
  async findCloseTickets(
    @GetUser() user: User,
  ) {
    const tickets = await this.usersService.findTicketsByUser(user.id, 'DESC')
    const closetickets = tickets.filter(ticket => ticket.estado === ESTADOS.CERRADO);
    return closetickets;
  }

  @Get('reports')
  @Auth(ROLES.ADMINISTRADOR)
  async findTicketsReports(@Query('mes') mes: number, @Query('anio') anio: number) {
    return this.usersService.findTicketsByUserReports(mes, anio);
  }

 
  @Get(':id')
  @Auth(ROLES.SOPORTE, ROLES.ADMINISTRADOR)
  async findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.usersService.findOneUser(id);
  }


  @Patch('edit/:id')
  @Auth(ROLES.SOPORTE, ROLES.ADMINISTRADOR)
  async update(
    @GetUser() user: User,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() body: UpdateUserDto,
  ) {
    return await this.usersService.updateUser(id, body, user);
  }

  @Put('reset-password/:id/:password')
  @Auth(ROLES.ADMINISTRADOR)
  async restPass(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Param('password') password: string,
  ) {
    return await this.usersService.resetPassword(id, password);
  }

  @Put('password')
  @Auth(ROLES.SOPORTE, ROLES.ADMINISTRADOR)
  async updatePassword(
    @GetUser() user: User,
    @Body() body: UpdateUserPassword,
  ) {
    return await this.usersService.updatePassword(user, body);
  }


  @Patch('add-estableishment/:id')
  @Auth(ROLES.ADMINISTRADOR)
  async addEstableishment(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() body: AddEstableishmentDto,
  ) {
    return await this.usersService.asigEstableishToUser(id, body);
  }

  @Patch('remove-estableishment/:id')
  @Auth(ROLES.ADMINISTRADOR)
  async removeEstableishment(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() body: AddEstableishmentDto,
  ) {
    return await this.usersService.removeEstableishmentToUser(
      id,
      body
    );
  }

  @Patch('add-category/:id')
  @Auth(ROLES.ADMINISTRADOR)
  async addCategory(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() body: AddCategoryDto,
  ) {
    return await this.usersService.asigCategoryToUser(id, body);
  }

  @Patch('remove-category/:id')
  @Auth(ROLES.ADMINISTRADOR)
  async removeCategory(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() body: AddCategoryDto,
  ) {
    return await this.usersService.removeCategorytToUser(
      id,
      body
    );
  }

}
