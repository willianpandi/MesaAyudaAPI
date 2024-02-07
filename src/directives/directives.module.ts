import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DirectivesService } from './directives.service';
import { DirectivesController } from './directives.controller';

import { Directive } from './entities/directive.entity';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Directive]), AuthModule, UsersModule],
  controllers: [DirectivesController],
  providers: [DirectivesService],
})
export class DirectivesModule {}
