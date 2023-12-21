import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketsService } from './tickets.service';
import { TicketsController } from './tickets.controller';

import { Ticket } from './entities/ticket.entity';
import { Directive } from 'src/directives/entities/directive.entity';
import { DirectivesService } from 'src/directives/directives.service';
// import { Profile } from 'src/profiles/entities/profile.entity';
// import { ProfilesService } from 'src/profiles/profiles.service';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { Estableishment } from 'src/estableishments/entities/estableishment.entity';
import { EstableishmentsService } from 'src/estableishments/estableishments.service';
import { DistrictsService } from 'src/districts/districts.service';
import { District } from 'src/districts/entities/district.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Ticket, Directive, User, Estableishment, District])],
  controllers: [TicketsController],
  providers: [TicketsService,  DirectivesService, UsersService, EstableishmentsService, DistrictsService],
})
export class TicketsModule {}
