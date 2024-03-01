import { Module } from '@nestjs/common';
import { SubCategoryService } from './sub-category.service';
import { SubCategoryController } from './sub-category.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubCategory } from './entities/sub-category.entity';
import { UsersModule } from '../users/users.module';
import { Category } from '../categories/entities/category.entity';
import { CategoriesService } from '../categories/categories.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([SubCategory, Category]),
    UsersModule,
  ],
  controllers: [SubCategoryController],
  providers: [SubCategoryService, CategoriesService],
  exports: [SubCategoryService, TypeOrmModule],
})
export class SubCategoryModule {}
