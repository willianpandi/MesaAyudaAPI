import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DistrictsService } from './districts.service';
import { DistrictsController } from './districts.controller';

import { District } from './entities/district.entity';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([District]), AuthModule, UsersModule],
  controllers: [DistrictsController],
  providers: [DistrictsService],
  exports: [DistrictsService, TypeOrmModule]
})
export class DistrictsModule {}
