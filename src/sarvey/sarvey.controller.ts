import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { SarveyService } from './sarvey.service';
import { SarveyDto, UpdateSarveyDto } from './dto/create-sarvey.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Encuestas')
@Controller('sarvey')
export class SarveyController {
  constructor(private readonly sarveyService: SarveyService) {}

  @Post('create/:id')
  async create(@Param('id') id: string, @Body() body: SarveyDto) {
    return await this.sarveyService.createSarvey(id, body);
  }

  @Get('all')
  async findAll() {
    return await this.sarveyService.findAllSarveys();
  }

  @Get(':id')
  async findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.sarveyService.findOneSarvey(id);
  }

  @Patch('edit/:id')
  async update(@Param('id', new ParseUUIDPipe()) id: string, @Body() body: UpdateSarveyDto) {
    return await this.sarveyService.updateSarvey(id, body);
  }

  // @Delete(':id')
  // async remove(@Param('id') id: string) {
  //   return this.sarveyService.removeSarvey(+id);
  // }
}
