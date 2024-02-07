import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EstableishmentsService } from './estableishments.service';
import { EstableishmentsController } from './estableishments.controller';

import { Estableishment } from './entities/estableishment.entity';
import { District } from '../districts/entities/district.entity';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Estableishment, District]), AuthModule, UsersModule],
  controllers: [EstableishmentsController],
  providers: [EstableishmentsService],
  exports: [EstableishmentsService, TypeOrmModule]
})
export class EstableishmentsModule {}
