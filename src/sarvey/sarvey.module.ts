import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SarveyService } from './sarvey.service';
import { SarveyController } from './sarvey.controller';

import { Sarvey } from './entities/sarvey.entity';
import { Ticket } from 'src/tickets/entities/ticket.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Sarvey, Ticket])],
  controllers: [SarveyController],
  providers: [SarveyService],
})
export class SarveyModule {}
