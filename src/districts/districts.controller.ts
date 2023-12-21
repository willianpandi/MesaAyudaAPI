import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { DistrictsService } from './districts.service';
import { DistrictDto, UpdateDistrictDto } from './dto/district.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Distritos')
@Controller('districts')
export class DistrictsController {
  constructor(private readonly districtsService: DistrictsService) {}

  @Post('create')
  async createD(@Body() body: DistrictDto) {
    return await this.districtsService.createDistrict(body);
  }

  @Get('all')
  async findAll() {
    return await this.districtsService.findAllDistricts();
  }

  @Get(':id')
  async findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.districtsService.findOneDistrict(id);
  }

  @Patch('edit/:id')
  async update(@Param('id', new ParseUUIDPipe()) id: string, @Body() body: UpdateDistrictDto) {
    return await this.districtsService.updateDistrict(id, body);
  }

  @Delete('delete/:id')
  async remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.districtsService.removeDistrict(id);
  }
}
