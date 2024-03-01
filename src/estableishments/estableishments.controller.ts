import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query } from '@nestjs/common';
import { EstableishmentsService } from './estableishments.service';
import { EstableishmentDto, UpdateEstableishmentDto } from './dto/estableishment.dto';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from '../auth/decorators/auth.decorator';
import { ROLES } from '../constants/opcions';

@ApiTags('Establecimientos')
@Controller('estableishments')
export class EstableishmentsController {
  constructor(private readonly estableishmentsService: EstableishmentsService) {}

  @Post('create')
  @Auth(ROLES.ADMINISTRADOR)
  async create(@Body() body: EstableishmentDto) {
    return await this.estableishmentsService.createEstableishment(body);
  }

  @Get('all')
  @Auth(ROLES.ADMINISTRADOR)
  async findAll() {
    return await this.estableishmentsService.findAllEstableishments();
  }
 
  @Get('reports/:id')
  @Auth(ROLES.ADMINISTRADOR)
  async findTicketsReports( @Param('id', new ParseUUIDPipe()) id: string, @Query('mes') mes: number, @Query('anio') anio: number) {
    return this.estableishmentsService.findTicketsByEstReports(id, mes, anio);
  }

  @Get('reports-eod/:id')
  @Auth(ROLES.ADMINISTRADOR)
  async findTicketsEODReports( @Param('id', new ParseUUIDPipe()) id: string, @Query('mes') mes: number, @Query('anio') anio: number) {
    return this.estableishmentsService.findTicketsByDistReports(id, mes, anio);
  }
  
  @Get('count')
  async getCount(){
    return await this.estableishmentsService.Count();
  }

  @Get('/:id')
  @Auth(ROLES.ADMINISTRADOR)
  async findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.estableishmentsService.findOneEstableishment(id);
  }

  @Patch('edit/:id')
  @Auth(ROLES.ADMINISTRADOR)
  async update(@Param('id', new ParseUUIDPipe()) id: string, @Body() body: UpdateEstableishmentDto) {
    return await this.estableishmentsService.updateEstableishment(id, body);
  }

  @Delete('delete/:id')
  @Auth(ROLES.ADMINISTRADOR)
  async remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.estableishmentsService.removeEstableishment(id);
  }


}
