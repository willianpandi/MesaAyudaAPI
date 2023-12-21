import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { EstableishmentsService } from './estableishments.service';
import { EstableishmentDto, UpdateEstableishmentDto } from './dto/estableishment.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Establecimientos')
@Controller('estableishments')
export class EstableishmentsController {
  constructor(private readonly estableishmentsService: EstableishmentsService) {}

  @Post('create')
  async create(@Body() body: EstableishmentDto) {
    return await this.estableishmentsService.createEstableishment(body);
  }

  @Get('all')
  async findAll() {
    return await this.estableishmentsService.findAllEstableishments();
  }
  
  @Get('/:id')
  async findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.estableishmentsService.findOneEstableishment(id);
  }

  @Patch('edit/:id')
  async update(@Param('id', new ParseUUIDPipe()) id: string, @Body() body: UpdateEstableishmentDto) {
    return await this.estableishmentsService.updateEstableishment(id, body);
  }

  @Delete('delete/:id')
  async remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.estableishmentsService.removeEstableishment(id);
  }
}
