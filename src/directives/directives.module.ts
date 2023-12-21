import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DirectivesService } from './directives.service';
import { DirectivesController } from './directives.controller';

import { Directive } from './entities/directive.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Directive])],
  controllers: [DirectivesController],
  providers: [DirectivesService],
})
export class DirectivesModule {}
