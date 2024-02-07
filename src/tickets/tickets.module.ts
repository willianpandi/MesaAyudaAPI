import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketsService } from './tickets.service';
import { TicketsController } from './tickets.controller';

import { Ticket } from './entities/ticket.entity';
import { Directive } from '../directives/entities/directive.entity';
import { User } from '../users/entities/user.entity';
import { District } from '../districts/entities/district.entity';
import { Estableishment } from '../estableishments/entities/estableishment.entity';
import { UsersService } from '../users/users.service';
import { DirectivesService } from '../directives/directives.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { File } from './entities/file.entity';
import { TicketDetalle } from './entities/tickDetalle.entity';


@Module({
  imports: [
    TypeOrmModule.forFeature([
      Ticket,
      Directive,
      User,
      Estableishment,
      District,
      File,
      TicketDetalle,
    ]),
    ConfigModule,
  ],
  controllers: [TicketsController],
  providers: [TicketsService, UsersService, DirectivesService, ConfigService],
  exports: [TicketsService, TypeOrmModule,],
})
export class TicketsModule {}
