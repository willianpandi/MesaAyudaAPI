import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

import { User } from './entities/user.entity';
import { Estableishment } from '../estableishments/entities/estableishment.entity';
import { Ticket } from '../tickets/entities/ticket.entity';
import { District } from '../districts/entities/district.entity';


@Module({
  imports: [
    // AuthModule,
    TypeOrmModule.forFeature([User, Estableishment, Ticket, District]),    
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService, TypeOrmModule],
})
export class UsersModule {}
