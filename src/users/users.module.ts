import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

import { User } from './entities/user.entity';
import { Estableishment } from '../estableishments/entities/estableishment.entity';
import { EstableishmentsService } from '../estableishments/estableishments.service';
import { DistrictsService } from '../districts/districts.service';
import { District } from '../districts/entities/district.entity';
import { CategoriesService } from '../categories/categories.service';
import { Category } from '../categories/entities/category.entity';
import { SubCategoryService } from '../sub-category/sub-category.service';
import { SubCategory } from '../sub-category/entities/sub-category.entity';


@Module({
  imports: [
    TypeOrmModule.forFeature([User, Estableishment, District, Category, SubCategory])  
  ],
  controllers: [UsersController],
  providers: [UsersService, EstableishmentsService, DistrictsService, CategoriesService, SubCategoryService],
  exports: [UsersService, TypeOrmModule],
})
export class UsersModule {}
