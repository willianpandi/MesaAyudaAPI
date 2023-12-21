import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  ParseUUIDPipe,
} from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { TicketDto, UpdateTicketDto } from './dto/ticket.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Tickets')
@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post('create/:id_u/:id_d')
  async create(@Body() body: TicketDto, @Param('id_u') id_u: string, @Param('id_d') id_d: string){
    return await this.ticketsService.createTicket(body, id_u, id_d);
  }

  @Get('all')
  async findAll() {
    return await this.ticketsService.findAllTickets();
  }

  @Get(':id')
  async findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.ticketsService.findOneTicket(id);
  }

  @Patch('edit/:id')
  async update(@Param('id', new ParseUUIDPipe()) id: string, @Body() body: UpdateTicketDto) {
    return await this.ticketsService.updateTicket(id, body);
  }

  @Delete('delete/:id')
  async remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.ticketsService.removeTicket(id);
  }
}
