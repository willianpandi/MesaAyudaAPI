import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
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
  @Auth(ROLES.SOPORTE, ROLES.ADMINISTRADOR)
  async createD(@Body() body: DistrictDto) {
    return await this.districtsService.createDistrict(body);
  }

  @Get('all')
  // @Auth(ROLES.USUARIO, ROLES.SOPORTE, ROLES.ADMINISTRADOR)
  async findAll() {
    return await this.districtsService.findAllDistricts();
  }

  @Get('count')
  @Auth(ROLES.USUARIO, ROLES.SOPORTE, ROLES.ADMINISTRADOR)
  async getCount(){
    return await this.districtsService.Count();
  }

  @Get(':id')
  // @Auth(ROLES.SOPORTE, ROLES.ADMINISTRADOR)
  async findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.districtsService.findOneDistrict(id);
  }

  @Patch('edit/:id')
  @Auth(ROLES.SOPORTE, ROLES.ADMINISTRADOR)
  async update(@Param('id', new ParseUUIDPipe()) id: string, @Body() body: UpdateDistrictDto) {
    return await this.districtsService.updateDistrict(id, body);
  }

  @Delete('delete/:id')
  @Auth(ROLES.SOPORTE, ROLES.ADMINISTRADOR)
  async remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.districtsService.removeDistrict(id);
  }
}
