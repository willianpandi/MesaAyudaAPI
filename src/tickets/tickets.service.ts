import { Injectable } from '@nestjs/common';
import { TicketDto, UpdateTicketDto } from './dto/ticket.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { Ticket } from './entities/ticket.entity';
import { ErrorManager } from 'src/config/error-manage';
import { DirectivesService } from 'src/directives/directives.service';
// import { ProfilesService } from 'src/profiles/profiles.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
    private readonly userService: UsersService,
    private readonly directiveService: DirectivesService,
    // @InjectRepository(Sarvey)    private readonly sarveyRepository: Repository<Sarvey>,
  ) {}

  async createTicket(
    body: TicketDto,
    id_user: string,
    id_directive: string,
    // id_sarvey: string,
  ): Promise<Ticket> {
    try {
      const user = await this.userService.findOneUser(id_user);
      const directive =
        await this.directiveService.findOneDirective(id_directive);
      // const sarveyFound = await this.sarveyRepository.findOne({
      //   where:{
      //     id: id_sarvey,
      //   }
      // });
      if (user === undefined && directive === undefined) {
        throw new ErrorManager({
         type: 'BAD_REQUEST',
          message: 'No existe el usuario o directiva',
        });
      }

      return await this.ticketRepository.save({ ...body, directive });
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  async findAllTickets(): Promise<Ticket[]> {
    try {
      const tickets: Ticket[] = await this.ticketRepository.find({
        relations: [
          'user',
          'user.estableishment',
          'user.estableishment.district',
          'directive',
          'sarvey',
        ],
      });
      if (tickets.length === 0) {
        throw new ErrorManager({
         type: 'BAD_REQUEST',
          message: 'No se encontro datos de Tickets',
        });
      }
      return tickets;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  async findOneTicket(id: string): Promise<Ticket> {
    try {
      const ticket: Ticket = await this.ticketRepository.findOne({
        where: {
          id,
        },
        relations: [
          'user',
          'user.estableishment',
          'user.estableishment.district',
          'directive',
          'sarvey',
        ],
      });
      if (!ticket) {
        throw new ErrorManager({
         type: 'BAD_REQUEST',
          message: 'No existe el ticket',
        });
      }
      return ticket;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  async updateTicket(id: string, body: UpdateTicketDto): Promise<UpdateResult> {
    try {
      const ticketFound = await this.ticketRepository.findOne({
        where: {
          id,
        },
      });
      if (!ticketFound) {
        throw new ErrorManager({
         type: 'BAD_REQUEST',
          message: 'No existe el ticket',
        });
      }

      const ticket: UpdateResult = await this.ticketRepository.update(id, body);
      if (ticket.affected === 0) {
        throw new ErrorManager({
         type: 'BAD_REQUEST',
          message: 'No se pudo actualizar el ticket',
        });
      }
      return ticket;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  async removeTicket(id: string): Promise<DeleteResult> {
    try {
      const ticket: DeleteResult = await this.ticketRepository.delete(id);
      if (ticket.affected === 0) {
        throw new ErrorManager({
         type: 'BAD_REQUEST',
          message: 'No se pudo eliminar el ticket',
        });
      }
      return ticket;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }
}
