import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query } from '@nestjs/common';
import { SubCategoryService } from './sub-category.service';
import { CreateSubCategoryDto, UpdateSubCategoryDto } from './dto/sub-category.dto';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from '../auth/decorators/auth.decorator';
import { ROLES } from '../constants/opcions';

@ApiTags('Sub-Categorias')
@Controller('sub-category')
export class SubCategoryController {
  constructor(private readonly subCategoryService: SubCategoryService) {}

  @Post('create')
  @Auth(ROLES.ADMINISTRADOR)
  create(@Body() body: CreateSubCategoryDto) {
    return this.subCategoryService.create(body);
  }

  @Get('all')
  async findAll() {
    return this.subCategoryService.findAllSubCategories();
  }

  @Get('reports')
  @Auth(ROLES.ADMINISTRADOR)
  async findReports(@Query('mes') mes: number, @Query('anio') anio: number) {
    return this.subCategoryService.findSubCategoryReports(mes, anio);
  }


  @Get(':id')
  @Auth(ROLES.ADMINISTRADOR)
  async findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.subCategoryService.findOneSubCategory(id);
  }

  @Patch('edit/:id')
  @Auth(ROLES.ADMINISTRADOR)
  async update(@Param('id', new ParseUUIDPipe()) id: string, @Body() body: UpdateSubCategoryDto) {
    return this.subCategoryService.updateSubCategory(id, body);
  }

  @Delete('delete/:id')
  @Auth(ROLES.ADMINISTRADOR)
  async remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.subCategoryService.removeSubCategory(id);
  }
}
