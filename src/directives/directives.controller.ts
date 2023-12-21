import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { DirectivesService } from './directives.service';
import { DirectiveDto, UpdateDirectiveDto } from './dto/directive.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Directivas')
@Controller('directives')
export class DirectivesController {
  constructor(private readonly directivesService: DirectivesService) {}

  @Post('create')
  async create(@Body() body: DirectiveDto) {
    return this.directivesService.createDirective(body);
  }

  @Get('all')
  async findAll() {
    return this.directivesService.findAllDirectives();
  }

  @Get(':id')
  async findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.directivesService.findOneDirective(id);
  }

  @Patch('edit/:id')
  async update(@Param('id', new ParseUUIDPipe()) id: string, @Body() body: UpdateDirectiveDto) {
    return this.directivesService.updateDirective(id, body);
  }

  @Delete('delete/:id')
  async remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.directivesService.removeDirective(id);
  }
}
