import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

import { User } from './entities/user.entity';
import { Estableishment } from 'src/estableishments/entities/estableishment.entity';
import { Ticket } from '../tickets/entities/ticket.entity';

import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { EstableishmentsService } from 'src/estableishments/estableishments.service';
import { District } from 'src/districts/entities/district.entity';
import { DistrictsService } from 'src/districts/districts.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([User, Estableishment, Ticket, District]),
    JwtModule.register({
      global: true,
      // secret: process.env.JWT_SEED,`.${process.env.NODE_ENV}.env`
      secret: `.${process.env.NODE_ENV}.env`,
      signOptions: { expiresIn: '6h' },
    }),          
],
  controllers: [UsersController],
  providers: [UsersService, EstableishmentsService, DistrictsService],
})
export class UsersModule {}
