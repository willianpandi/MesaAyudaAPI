import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';

import { CategoryDto, UpdateCategoryDto } from './dto/category.dto';
import { Category } from './entities/category.entity';
import { SubCategory } from '../sub-category/entities/sub-category.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async createCategory(body: CategoryDto): Promise<Category> {
    const categoryFound = await this.categoryRepository.findOne({
      where: {
        nombre: body.nombre,
      },
    });
    if (categoryFound) {
      throw new BadRequestException(
        'Ya existe una categoria con el nombre ingresado',
      );
    }
    return await this.categoryRepository.save({...body, createdAt: new Date(),updateAt: new Date()});
  }

  
  async findAllCategories(): Promise<Category[]> {
    const categories: Category[] = await this.categoryRepository.find();
    if (categories.length === 0) {
      throw new NotFoundException('No se encontro datos de categorias de ayuda');
    }
    return categories;
  }

  async Count(): Promise<{ totalCountCategories: number }> {
    const totalCountCategories = await this.categoryRepository.count();
    return { totalCountCategories };
  }

  async findSubCategoriesByCategory(id: string): Promise<SubCategory[]> {
    const category: Category = await this.categoryRepository.findOne({
      where: {id},
      relations: ['subcategories']
    });
    if (!category) {
      throw new NotFoundException('La categoria no fue encontrado');
    }
    return category.subcategories;
  }

  async findOneCategory(id: string): Promise<Category> {
    const category: Category = await this.categoryRepository.findOne({
      where: {
        id,
      },  
      relations: ['tickets'],
    });
    if (!category) {
      throw new NotFoundException('La categoria no fue encontrado');
    }
    return category;
  }
    

  async updateCategory(
    id: string,
    body: UpdateCategoryDto,
  ): Promise<UpdateResult> {
    const categoryFound = this.categoryRepository.findOne({
      where: {
        id,
      },
    });
    if (!categoryFound) {
      throw new NotFoundException('No existe la categoria');
    }

    const category: UpdateResult = await this.categoryRepository.update(
      id,
      {...body, updateAt: new Date()}
    );
    if (category.affected === 0) {
      throw new BadRequestException('No se pudo actualizar la categoria');
    }
    return category;
  }

  async removeCategory(id: string) {
    const category = await this.findOneCategory(id);
    if (!category) {
      throw new BadRequestException('No existe la categoria');
    }
    await this.categoryRepository.remove(category);
  }
}
