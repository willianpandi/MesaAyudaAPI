import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesService } from './categories.service';
import { CategoryController } from './categories.controller';

import { Category } from './entities/category.entity';
import { SubCategory } from '../sub-category/entities/sub-category.entity';
import { UsersModule } from '../users/users.module';


@Module({
  imports: [
    TypeOrmModule.forFeature([Category, SubCategory]), UsersModule,
  ],
  controllers: [CategoryController],
  providers: [CategoriesService],
  exports: [CategoriesService, TypeOrmModule],
})
export class CategoriesModule {}
