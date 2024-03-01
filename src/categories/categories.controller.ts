import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { Auth } from '../auth/decorators/auth.decorator';
import { CategoryDto, UpdateCategoryDto } from './dto/category.dto';
import { CategoriesService } from './categories.service';
import { ROLES } from '../constants/opcions';

@ApiTags('Categorias')
@Controller('categories')

export class CategoryController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post('create')
  @Auth(ROLES.ADMINISTRADOR)
  async create(@Body() body: CategoryDto) {
    return this.categoriesService.createCategory(body);
  }

  @Get('all')
  async findAll() {
    return this.categoriesService.findAllCategories();
  }

  @Get('count')
  async getCount(){
    return await this.categoriesService.Count();
  }

  @Get('sub-category/:id')
  async findSubCategories(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.categoriesService.findSubCategoriesByCategory(id);
  }

  @Get(':id')
  @Auth(ROLES.ADMINISTRADOR)
  async findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.categoriesService.findOneCategory(id);
  }
  

  @Patch('edit/:id')
  @Auth(ROLES.ADMINISTRADOR)
  async update(@Param('id', new ParseUUIDPipe()) id: string, @Body() body: UpdateCategoryDto) {
    return this.categoriesService.updateCategory(id, body);
  }

  @Delete('delete/:id')
  @Auth(ROLES.ADMINISTRADOR)
  async remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.categoriesService.removeCategory(id);
  }
}
