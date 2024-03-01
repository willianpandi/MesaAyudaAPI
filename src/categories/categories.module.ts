import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesService } from './categories.service';
import { CategoryController } from './categories.controller';

import { Category } from './entities/category.entity';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { EstableishmentsService } from '../estableishments/estableishments.service';
import { Estableishment } from '../estableishments/entities/estableishment.entity';
import { DistrictsService } from '../districts/districts.service';
import { District } from '../districts/entities/district.entity';
import { UsersModule } from '../users/users.module';
import { SubCategory } from 'src/sub-category/entities/sub-category.entity';


@Module({
  imports: [
    TypeOrmModule.forFeature([Category, SubCategory]), UsersModule,
  ],
  controllers: [CategoryController],
  providers: [CategoriesService],
  exports: [CategoriesService, TypeOrmModule],
})
export class CategoriesModule {}
