import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Repository, UpdateResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Ticket } from './entities/ticket.entity';
import { TicketDto, UpdateTicketDto } from './dto/ticket.dto';

import { User } from '../users/entities/user.entity';
import { CategoriesService } from '../categories/categories.service';
import { ESTADOS, OPORTUNO, ROLES, SATISFACCION, S_PROBLEMA } from '../constants/opcions';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { existsSync } from 'fs';
import { File } from './entities/file.entity';
import { SubCategory } from '../sub-category/entities/sub-category.entity';
import { SubCategoryService } from '../sub-category/sub-category.service';
import { EstableishmentsService } from '../estableishments/estableishments.service';
import { UsersService } from '../users/users.service';
import { MailerService } from '@nestjs-modules/mailer';

export type SendEmailDto = {
  destinatario: string[];
  asunto: string;
  mensaje: string;
}

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
    @InjectRepository(File)
    private readonly fileRepository: Repository<File>,
    private readonly categoriesService: CategoriesService,
    private readonly subCategoriesService: SubCategoryService,
    private readonly estableishmentsService: EstableishmentsService,
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
    private readonly mailerService: MailerService,
  ) {}

  async sendEmail(body: SendEmailDto, ticket: Ticket): Promise<void> {
    const fechaCreacion = new Date(ticket.createdAt);
    const fechaFormateada = fechaCreacion.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
    });

    const mensajeConInformacion = `
      <p>${body.mensaje}</p>
      <p>Información del ticket:</p>
      <ul>
      <li><strong>Fecha de creación:</strong> ${fechaFormateada}</li>
      <li><strong>Nombre:</strong> ${ticket.nombre}</li>
      <li><strong>Tema de Ayuda:</strong> ${ticket.category.nombre}</li>
      <li><strong>Sub-Tema:</strong> ${ticket.subcategory.nombre}</li>
      <li><strong>Establecimiento:</strong> ${ticket.estableishment.nombre}</li>
      <li><strong>Soporte Asignado:</strong> ${ticket.soporteAsignado}</li>
      <li><strong>Requerimiento / Problema / Pedido:</strong> ${ticket.requerimiento}</li>
      </ul><br><br>
      <p>Gestión Zonal de Tecnologías de la Información y Comunicaciones</p>
      <p>Coordinación Zonal 3 - Salud</p>
      `;
      
    await this.mailerService.sendMail({
      to: body.destinatario,
      subject: body.asunto,
      text: body.mensaje,
      html: mensajeConInformacion,
    });
  }

  async createTicket(
    body: TicketDto,
    file: Express.Multer.File,
  ): Promise<Ticket> {

    const category = await this.categoriesService.findOneCategory(
      body.category,
    );

    if (!category) {
      throw new NotFoundException('La categorya especificada no existe');
    }

    let subcategory: SubCategory;

    if (body.subcategory) {
      subcategory = await this.subCategoriesService.findOneSubCategory(body.subcategory);
      if (!subcategory) {
        throw new NotFoundException('Subcategoría no válida');
      }
    }

    const estableishment = await this.estableishmentsService.findOneEstableishment(
      body.estableishment,
    );

    if (!estableishment) {
      throw new NotFoundException('El establecimiento especificado no existe');
    }
    
    const user = await this.usersService.findUserWithEstSubCat(body.estableishment, body.category);

    if (!user) {
      throw new NotFoundException('No existe un usuario soporte a quien se pueda asignar el ticket');
    }

    let savedFile: File | undefined;
    if (file) {
      savedFile = await this.createFile(file);      
    }



    const newTicket = this.ticketRepository.create({
      ...body,
      category,
      subcategory,
      estableishment,
      estado: ESTADOS.ABIERTO,
      soporteAsignado: user.nombre,
      file: savedFile,
      createdAt: new Date(),
      updateAt: new Date(),
    });

    const savedTicket = await this.ticketRepository.save(newTicket);
    
    await this.sendEmail({
        destinatario: [savedTicket.correo_electronico, user.correo_institucional],
        asunto: `Nuevo Ticket Creado: ${savedTicket.codigo}`,
        mensaje: `Detalles del <strong>Ticket ${savedTicket.codigo}</strong>.`,
      }, savedTicket);
      
    return savedTicket;
  }

  async createTicketBySupport(
    body: TicketDto,
  ): Promise<UpdateResult> {
    const categoryFound = await this.categoriesService.findOneCategory(
      body.category,
    );

    if (!categoryFound) {
      throw new NotFoundException('La categorya especificada no existe');
    }

    let subcategoryFound: SubCategory;

    if (body.subcategory) {
      subcategoryFound = await this.subCategoriesService.findOneSubCategory(body.subcategory);
      if (!subcategoryFound) {
        throw new NotFoundException('Subcategoría no válida');
      }
    }

    const estableishmentFound = await this.estableishmentsService.findOneEstableishment(
      body.estableishment,
    );

    if (!estableishmentFound) {
      throw new NotFoundException('El establecimiento especificado no existe');
    }

    const user = await this.usersService.findUserByName(body.soporteAsignado);

    if (!user) {
      throw new NotFoundException('No existe un usuario soporte a quien se pueda asignar el ticket');
    }
    const newTicket = this.ticketRepository.create({
      ...body,
      category: categoryFound,
      subcategory: subcategoryFound,
      estableishment: estableishmentFound,
      createdAt: new Date(),
      updateAt: new Date(),
    });
    const savedTicket = await this.ticketRepository.save(newTicket);

    const { id, category, subcategory, estableishment, estado, ...bodyTicket } = savedTicket;

    await this.sendEmail({
      destinatario: [savedTicket.correo_electronico, user.correo_institucional],
      asunto: `Nuevo Ticket Creado: ${savedTicket.codigo}`,
      mensaje: `Detalles del <strong>Ticket ${savedTicket.codigo}</strong>.`,
    }, savedTicket);
    
    const ticketClose = await this.updateCloseTicket(id, {estado: ESTADOS.CERRADO, ...bodyTicket} )

    return ticketClose;
  }



  async findAllTickets(inicio?: string, fin?: string): Promise<Ticket[]> {    

    let query = this.ticketRepository.createQueryBuilder('ticket')
      .leftJoinAndSelect('ticket.category', 'category')
      .leftJoinAndSelect('ticket.subcategory', 'subcategory')
      .leftJoinAndSelect('ticket.estableishment', 'estableishment')
      .leftJoinAndSelect('ticket.file', 'file');

    if (inicio && fin) {
      const fechaInicio = new Date(inicio);
      const fechaFin = new Date(fin);
      fechaFin.setHours(23, 59, 59);

      query = query.where('ticket.createdAt BETWEEN :inicio AND :fin', { inicio: fechaInicio, fin: fechaFin });
    }

    query = query.orderBy('ticket.codigo', 'DESC');

    const tickets: Ticket[] = await query.getMany();

    if (tickets.length === 0) {
      throw new NotFoundException('No se encontraron datos de tickets');
    }

    return tickets;
  }
 
  async findTickets(cedula: string): Promise<any[]> {  
    const tickets: Ticket[] = await this.ticketRepository.find({where: {cedula}, order: { codigo: 'DESC' }})
    if (tickets.length === 0) {
      throw new NotFoundException('No se encontro datos de tickets');
    }
    const userTickets = tickets.map(ticket => {  
      return {
        id: ticket.id,
        codigo: ticket.codigo,
        estado: ticket.estado,
        soporteAsignado: ticket.soporteAsignado,
        soporteReasignado: ticket.soporteReasignado,
        satisfaccion: ticket.satisfaccion,
      };
    });

    return userTickets;
  }

  async findAllTicketsReasig(mesFiltro?: number, anioFiltro?: number): Promise<any[]> {
    const tickets: Ticket[] = await this.ticketRepository.find({ relations: ['category', 'subcategory', 'estableishment'] });

    const ticketsPorNombreAsignado = tickets.reduce((result, ticket) => {
      const nombreAsignado = ticket.soporteReasignado;
      
      if (nombreAsignado !== null && nombreAsignado !== "") {
        const fechaCreacion = new Date(ticket.createdAt);
        if ((!mesFiltro && !anioFiltro) || (fechaCreacion.getMonth() === mesFiltro - 1 && fechaCreacion.getFullYear() ===  Number(anioFiltro) )) {
          
          if (!result[nombreAsignado]) {
            result[nombreAsignado] = {
              nombreAsignado,
              totalTickets: 0,
              ticketsAbiertos: 0,
              ticketsEnProceso: 0,
              ticketsCerrados: 0,
              ticketsNS: 0,
              ticketsAS: 0,
              ticketsS: 0,
              ticketsMS: 0,
              ticketsATiempo: 0,
              ticketsAtrasados: 0,
              ticketsOportuno: 0,
              ticketsNoOportuno: 0,
              ticketsSolucionado: 0,
              ticketsNoSolucionado: 0,
            };
          }
        

          result[nombreAsignado].totalTickets++;
          if (ticket.estado === ESTADOS.ABIERTO) {
            result[nombreAsignado].ticketsAbiertos++;
          } else if (ticket.estado === ESTADOS.EN_PROCESO) {
            result[nombreAsignado].ticketsEnProceso++;
          } else if (ticket.estado === ESTADOS.CERRADO) {
            result[nombreAsignado].ticketsCerrados++;
            const tiempoOcupado = ticket.tiempoOcupado;
            const tiempoSubcategoria = ticket.subcategory.tiempo;

            if (tiempoSubcategoria - tiempoOcupado >= 0) {
              result[nombreAsignado].ticketsATiempo++;
            } else {
              result[nombreAsignado].ticketsAtrasados++;
            }
          }

          switch (ticket.satisfaccion) {
            case SATISFACCION.N_S:
              result[nombreAsignado].ticketsNS++;
              break;
            case SATISFACCION.P_S:
              result[nombreAsignado].ticketsAS++;
              break;
            case SATISFACCION.S:
              result[nombreAsignado].ticketsS++;
              break;
            case SATISFACCION.M_S:
              result[nombreAsignado].ticketsMS++;
              break;
          }

          switch (ticket.a_oportuna) {
            case OPORTUNO.SI:
              result[nombreAsignado].ticketsOportuno++;
              break;
            case OPORTUNO.NO:
              result[nombreAsignado].ticketsNoOportuno++;
              break;
          }
          switch (ticket.s_problema) {
            case S_PROBLEMA.SI:
              result[nombreAsignado].ticketsSolucionado++;
              break;
            case S_PROBLEMA.NO:
              result[nombreAsignado].ticketsNoSolucionado++;
              break;
          }
        }
      }

      return result;
    }, {});

    const totalRow = Object.values(ticketsPorNombreAsignado).reduce((acc, curr) => {
      Object.keys(curr).forEach(key => {
        if (key !== 'nombreAsignado') {
          acc[key] = (acc[key] || 0) + curr[key];
        }
      });
      return acc;
    }, { nombreAsignado: 'TOTAL' });
    const resultArray = [...Object.values(ticketsPorNombreAsignado), totalRow];
  
    return resultArray;
  }
  
  async findAllTicketsAsig(userr: User): Promise<Ticket[]> {    

    const tickets: Ticket[] = await this.ticketRepository.find({
       where: {soporteReasignado:userr.nombre},
       order: { codigo: 'DESC' },
       relations: ['category', 'subcategory', 'estableishment', 'file']
    })
    if (tickets.length === 0) {
      throw new NotFoundException('No se encontro datos de tickets');
    }

    return tickets;
  }


  async Count(): Promise<{ totalCountTickets: number }> {
    const totalCountTickets = await this.ticketRepository.count();
    return { totalCountTickets };
  }


  async findOneTicket(id: string): Promise<Ticket> {
    const ticket: Ticket = await this.ticketRepository.findOne({
      where: {id},
      relations: ['category', 'subcategory', 'estableishment', 'file'],
    });
    if (!ticket) {
      throw new NotFoundException('El ticket no fue encontrado');
    }
    return ticket;
  }
 
  async searchTickets(cedula: string): Promise<Ticket[]> {
    const tickets: Ticket[] = await this.ticketRepository.find({
      where: {
        cedula
      },
    });
    if (!tickets) {
      throw new NotFoundException('El usuario no tiene tickets');
    }
    return tickets;
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
    
    const { category, subcategory, estableishment, ...updatedData } = body;

    const ticket: UpdateResult = await this.ticketRepository.update(id, {...updatedData, updateAt: new Date()});
    if (ticket.affected === 0) {
      throw new BadRequestException('No se pudo actualizar el ticket');
    }
    return ticket;
  }
 
  async updateDepartTicket(id: string, body: UpdateTicketDto): Promise<UpdateResult> {
    const ticket = await this.ticketRepository.findOne({
      where: {
        id,
      },
    });
    const subcategory = await this.subCategoriesService.findOneSubCategory(body.subcategory);

    if (!ticket && !subcategory) {
      throw new NotFoundException('No existe el ticket o el Departamento de Ayuda');
    }
    
    const ticketupdate: UpdateResult = await this.ticketRepository.update(id, {subcategory, updateAt: new Date()});
    if (ticketupdate.affected === 0) {
      throw new BadRequestException('No se pudo actualizar el Departamento del ticket');
    }
    return ticketupdate;
  }

  async updateCloseTicket(id: string, body: UpdateTicketDto): Promise<UpdateResult> {
    const ticketFound = await this.findOneTicket(id);
    if (!ticketFound) {
      throw new NotFoundException('No existe el ticket');
    }

    const fechaActual = new Date();

    const createdAt = new Date(ticketFound.createdAt);
    const resigAt = new Date(ticketFound.reasignadoAt);

    // const tiempoOcupado = Math.floor((fechaActual.getTime() - createdAt.getTime()) / (1000 * 60));
    const tiempoOcupado = this.calculartiempo(createdAt, fechaActual);


    let tiempoReasignado: number;
    if (ticketFound.reasignadoAt) {
      // tiempoReasignado = Math.floor((fechaActual.getTime() - ticketFound.reasignadoAt.getTime()) / (1000 * 60));
      tiempoReasignado = this.calculartiempo(resigAt, fechaActual);
    }

          
    const { category, subcategory, estableishment,  ...updatedData } = body;

    const ticket: UpdateResult = await this.ticketRepository.update(id, {
      ...updatedData, 
      tiempoOcupado, 
      tiempoReasignado, 
      cierreAt: fechaActual, 
      updateAt: fechaActual
    });
    if (ticket.affected === 0) {
      throw new BadRequestException('No se pudo actualizar el estado del ticket a CERRADO');
    }

    await this.sendEmail({
      destinatario: [ticketFound.correo_electronico],
      asunto: `Ticket Cerrado: ${ticketFound.codigo}`,
      mensaje: `El <strong>Ticket ${ticketFound.codigo} </strong>, ha sido CERRADO. <br> Por favor realice el siguiente formulario de satisfacción: ${this.configService.get('HOST_FRONT')}/${ticketFound.id}`,
    }, ticketFound);

    return ticket;
  }


  calculartiempo (startDate: Date, endDate: Date): number {

    return Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60));

  }
  
  async updateReasigTicket(id: string, body: UpdateTicketDto): Promise<UpdateResult> {
    const ticketFound = await this.findOneTicket(id);
    if (!ticketFound) {
      throw new NotFoundException('No existe el ticket');
    }

    const fechaActual = new Date();

    const { soporteReasignado } = body;

    const user = await this.usersService.findUserByName(soporteReasignado);
    if (!user) {
      throw new NotFoundException('No existe un usuario soporte a quien reasignar el ticket');
    }

    const ticket: UpdateResult = await this.ticketRepository.update(id, {soporteReasignado, reasignadoAt: fechaActual, updateAt: new Date()});
    if (ticket.affected === 0) {
      throw new BadRequestException('No se pudo reasignar el ticket');
    }

    await this.sendEmail({
      destinatario: [ticketFound.correo_electronico, user.correo_institucional],
      asunto: `Ticket Reasignado: ${ticketFound.codigo}`,
      mensaje: `El <strong>Ticket ${ticketFound.codigo} </strong>, ha sido <strong>REASIGNADO</strong>.<br><strong>Soporte Reasignado:</strong> ${user.nombre}`,
    }, ticketFound);

    return ticket;
  }

  async removeTicket(id: string) {
    const ticketFound = await this.findOneTicket(id);
    if (!ticketFound) {
      throw new BadRequestException('No existe el ticket');
    }

    await this.ticketRepository.remove(ticketFound);
  }


  //SERVICIOS DE SUBIR ARCHIVOS
  async createFile(
    file: Express.Multer.File,
  ): Promise<File> {
    if (!file) {
      throw new BadRequestException(
        'Asegurate de subir un archivo',
      );
    }

    const secureUrl = `${this.configService.get('HOST_API')}/tickets/file/${
      file.filename
    }`;

    const savedFile = await this.fileRepository.save({
      archivo: secureUrl,
      createdAt: new Date(),
      updateAt: new Date()
    });

    return savedFile;
  }

  getFileName(fileName: string) {
    const path = join(__dirname, '../../uploads/files', fileName);

    if (!existsSync(path))
      throw new BadRequestException('No se encontro el archivo');

    return path;
  }

}
