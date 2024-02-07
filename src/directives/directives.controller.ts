import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { Auth } from '../auth/decorators/auth.decorator';
import { DirectiveDto, UpdateDirectiveDto } from './dto/directive.dto';
import { DirectivesService } from './directives.service';
import { ROLES } from '../constants/opcions';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '../users/entities/user.entity';

@ApiTags('Directivas')
@Controller('directives')

export class DirectivesController {
  constructor(private readonly directivesService: DirectivesService) {}

  @Post('create')
  @Auth(ROLES.SOPORTE, ROLES.ADMINISTRADOR)
  async create(@Body() body: DirectiveDto) {
    return this.directivesService.createDirective(body);
  }

  @Get('all')
  @Auth(ROLES.SOPORTE, ROLES.USUARIO, ROLES.ADMINISTRADOR)
  async findAll() {
    return this.directivesService.findAllDirectives();
  }


  @Get(':id')
  @Auth(ROLES.SOPORTE, ROLES.ADMINISTRADOR)
  async findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.directivesService.findOneDirective(id);
  }

  @Patch('edit/:id')
  @Auth(ROLES.SOPORTE, ROLES.ADMINISTRADOR)
  async update(@Param('id', new ParseUUIDPipe()) id: string, @Body() body: UpdateDirectiveDto) {
    return this.directivesService.updateDirective(id, body);
  }

  @Delete('delete/:id')
  @Auth(ROLES.SOPORTE, ROLES.ADMINISTRADOR)
  async remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.directivesService.removeDirective(id);
  }
}
