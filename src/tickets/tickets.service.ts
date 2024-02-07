import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Ticket } from './entities/ticket.entity';
import { TicketDetalleDto, TicketDto, UpdateTicketDto } from './dto/ticket.dto';

import { User } from '../users/entities/user.entity';
import { DirectivesService } from '../directives/directives.service';
import { ROLES } from '../constants/opcions';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { existsSync } from 'fs';
import { File } from './entities/file.entity';
import { UsersService } from 'src/users/users.service';
import { TicketDetalle } from './entities/tickDetalle.entity';

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
    @InjectRepository(File)
    private readonly fileRepository: Repository<File>,
    @InjectRepository(TicketDetalle)
    private readonly ticketDetalleRepository: Repository<TicketDetalle>,
    private readonly directiveService: DirectivesService,
    private readonly configService: ConfigService,
    private readonly userService: UsersService,
  ) {}

  async createTicket(
    body: TicketDto,
    file: Express.Multer.File,
    user: User,
  ): Promise<Ticket> {
    const directive = await this.directiveService.findOneDirective(
      body.directive.id,
    );

    if (!directive) {
      throw new NotFoundException('La directiva especificada no existe');
    }

    const soporteUser = await this.userService.findOneUser(body.soporteUser);
    if (!soporteUser || soporteUser.rol !== ROLES.SOPORTE) {
      throw new NotFoundException(
        'El usuario de soporte especificado no existe o no es un usuario de soporte',
      );
    }

    const newTicket = this.ticketRepository.create({
      ...body,
      user,
      soporteUser,
    });
    const savedTicket = await this.ticketRepository.save(newTicket);

    if (file) {
      await this.createFile(file, newTicket.id);
    }

    return savedTicket;
  }

  async findAllTickets(userr: User): Promise<Ticket[]> {
    if (userr.rol === ROLES.ADMINISTRADOR) {
      const Alltickets: Ticket[] = await this.ticketRepository.find({
        relations: [
          'user',
          'user.estableishment',
          'user.estableishment.district',
          'directive',
        ],
      });

      if (Alltickets.length === 0) {
        throw new NotFoundException('No se encontro datos de tickets');
      }
      return Alltickets;
    } else if (userr.rol === ROLES.SOPORTE) {
      const ticketBySoporte: Ticket[] = await this.ticketRepository.find({
        where: { soporteUser: { id: userr.id } },
        relations: [
          'user',
          'user.estableishment',
          'user.estableishment.district',
          'directive',
        ],
      });

      if (ticketBySoporte.length === 0) {
        throw new NotFoundException('No se encontro datos de tickets');
      }
      return ticketBySoporte;
    } else {
      const ticketByUser: Ticket[] = await this.ticketRepository.find({
        where: { user: { id: userr.id } },
        relations: [
          'user',
          'user.estableishment',
          'user.estableishment.district',
          'directive',
        ],
      });

      if (ticketByUser.length === 0) {
        throw new NotFoundException('No se encontro datos de tickets');
      }
      return ticketByUser;
    }
  }

  async Count(): Promise<{ totalCountTickets: number }> {
    const totalCountTickets = await this.ticketRepository.count();
    return { totalCountTickets };
  }

  async findOneTicket(id: string): Promise<Ticket> {
    const ticket: Ticket = await this.ticketRepository.findOne({
      where: {
        id,
      },
      relations: [
        'user',
        'user.estableishment',
        'user.estableishment.district',
        'directive',
        'files',
        'ticketdetalle',
      ],
    });
    if (!ticket) {
      throw new NotFoundException('El ticket no fue encontrado');
    }
    return ticket;
  }

  async updateTicket(id: string, body: UpdateTicketDto): Promise<UpdateResult> {
    const ticketFound = await this.ticketRepository.findOne({
      where: {
        id,
      },
    });
    if (!ticketFound) {
      throw new NotFoundException('No existe el ticket');
    }
    const soporteUser = await this.userService.findOneUser(body.soporteUser);
    if (!soporteUser || soporteUser.rol !== ROLES.SOPORTE) {
      throw new NotFoundException(
        'El usuario de soporte especificado no existe o no es un usuario de soporte',
      );
    }

    const ticket: UpdateResult = await this.ticketRepository.update(id, {...body, soporteUser});
    if (ticket.affected === 0) {
      throw new BadRequestException('No se pudo actualizar el ticket');
    }
    return ticket;
  }

  async removeTicket(id: string) {
    const ticketFound = await this.findOneTicket(id);

    if (!ticketFound) {
      throw new NotFoundException('No existe el ticket');
    }

    await this.ticketRepository.remove(ticketFound);
  }

  //DETALLE TICKETS

  async detalles(id: string): Promise<TicketDetalle[]> {
    const ticket: Ticket = await this.findOneTicket(id);
    if (!ticket) {
      throw new NotFoundException('El ticket no fue encontrado');
    }
    return ticket.ticketdetalle;
  }

  async saveDetalle(id: string, body: TicketDetalleDto): Promise<TicketDetalle> {
    const ticket: Ticket = await this.findOneTicket(id);
    if (!ticket) {
      throw new NotFoundException('El ticket no fue encontrado');
    }

    const newTicketDetalle = this.ticketDetalleRepository.create({
      ...body,
      ticket
    });
    const savedTicket = await this.ticketDetalleRepository.save(newTicketDetalle);
    return savedTicket;
  }

  //SERVICIOS DE SUBIR ARCHIVOS
  async createFile(
    file: Express.Multer.File,
    id_ticket: string,
  ): Promise<File> {
    if (!file) {
      throw new BadRequestException(
        'Asegurate de que el archivo sea una imagen',
      );
    }

    const secureUrl = `${this.configService.get('HOST_API')}/tickets/file/${
      file.filename
    }`;

    const ticket = await this.findOneTicket(id_ticket);

    if (!ticket) {
      throw new BadRequestException('No existe el ticket');
    }

    const savedFile = await this.fileRepository.save({
      archivo: secureUrl,
      ticket,
    });

    return savedFile;
  }

  getFileName(fileName: string) {
    const path = join(__dirname, '../../uploads/files', fileName);

    if (!existsSync(path))
      throw new BadRequestException('No se encontro el archivo');

    return path;
  }

  async getFiles(id: string) {
    const ticketFound = await this.findOneTicket(id);
    if (!ticketFound) {
      throw new BadRequestException('No existe el ticket');
    }
    const files: File[] = await this.fileRepository.find({
      where: { ticket: { id } },
    });
    return files;
  }
}
