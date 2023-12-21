import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EstableishmentsService } from './estableishments.service';
import { EstableishmentsController } from './estableishments.controller';

import { Estableishment } from './entities/estableishment.entity';
import { DistrictsService } from 'src/districts/districts.service';
import { District } from 'src/districts/entities/district.entity';
import { DistrictsModule } from 'src/districts/districts.module';

@Module({
  imports: [TypeOrmModule.forFeature([Estableishment, District])],
  controllers: [EstableishmentsController],
  providers: [EstableishmentsService, DistrictsService],
})
export class EstableishmentsModule {}
