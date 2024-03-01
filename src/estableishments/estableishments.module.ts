import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EstableishmentsService } from './estableishments.service';
import { EstableishmentsController } from './estableishments.controller';

import { Estableishment } from './entities/estableishment.entity';
import { District } from '../districts/entities/district.entity';
import { UsersModule } from '../users/users.module';
import { DistrictsService } from '../districts/districts.service';

@Module({
  imports: [TypeOrmModule.forFeature([Estableishment, District]), UsersModule],
  controllers: [EstableishmentsController],
  providers: [EstableishmentsService, DistrictsService],
  exports: [EstableishmentsService, TypeOrmModule]
})
export class EstableishmentsModule {}
