import { Controller, Get, Post, Body, Patch, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { Auth } from '../auth/decorators/auth.decorator';
import { DistrictDto, UpdateDistrictDto } from './dto/district.dto';
import { DistrictsService } from './districts.service';
import { ROLES } from '../constants/opcions';

@ApiTags('Distritos')
@Controller('districts')
export class DistrictsController {
  constructor(private readonly districtsService: DistrictsService) {}

  @Post('create')
  @Auth(ROLES.ADMINISTRADOR)
  async createD(@Body() body: DistrictDto) {
    return await this.districtsService.createDistrict(body);
  }

  @Get('all-active')
  async findAllActive() {
    const districts = await this.districtsService.findAllDistricts();
    const activeDistricts = districts.filter(district => district.estado === true);
    return activeDistricts;
  }

  @Get('all')
  @Auth(ROLES.ADMINISTRADOR)
  async findAll() {
    return await this.districtsService.findAllDistricts();
  }

  @Get('count')
  @Auth(ROLES.ADMINISTRADOR)
  async getCount(){
    return await this.districtsService.Count();
  }

  @Get(':id')
  @Auth(ROLES.ADMINISTRADOR)
  async findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.districtsService.findOneDistrict(id);
  }
  @Get('estableishments/:id')
  // @Auth(ROLES.ADMINISTRADOR)
  async findAllByDistrict(@Param('id', new ParseUUIDPipe()) id: string) {
    const estableishments = await this.districtsService.findEstableishmentByDistrict(id);
    const activeEstableishments = estableishments.filter(estableishment => estableishment.estado === true);
    return activeEstableishments;
  }

  @Get('reports/:id')
  @Auth(ROLES.ADMINISTRADOR)
  async findTicketsReports( @Param('id', new ParseUUIDPipe()) id: string, @Query('mes') mes: number, @Query('anio') anio: number) {
    return this.districtsService.findTicketsByEODReports(id, mes, anio);
  }


  @Patch('edit/:id')
  @Auth(ROLES.ADMINISTRADOR)
  async update(@Param('id', new ParseUUIDPipe()) id: string, @Body() body: UpdateDistrictDto) {
    return await this.districtsService.updateDistrict(id, body);
  }
  
}
