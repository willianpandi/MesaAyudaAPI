import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';

import {
  EstableishmentDto,
  UpdateEstableishmentDto,
} from './dto/estableishment.dto';
import { Estableishment } from './entities/estableishment.entity';
import { DistrictsService } from '../districts/districts.service';
import { ESTADOS, OPORTUNO, SATISFACCION, S_PROBLEMA } from 'src/constants/opcions';

@Injectable()
export class EstableishmentsService {
  constructor(
    @InjectRepository(Estableishment)
    private readonly estableishmentRepository: Repository<Estableishment>,
    private readonly districtService: DistrictsService,
  ) {}

  async createEstableishment(body: EstableishmentDto): Promise<Estableishment> {
    const EstableishFound = await this.estableishmentRepository.findOne({
      where: {
        codigo: body.codigo,
      },
    });
    if (EstableishFound) {
      throw new BadRequestException(
        'Ya existe un establecimiento con código ingresado',
      );
    }

    const district = await this.districtService.findOneDistrict(body.district)
    if (!district) {
      throw new BadRequestException(
        'No existe el distrito ingresado',
      );
    }
    return await this.estableishmentRepository.save({...body, district});
  }

  async findAllEstableishments(): Promise<Estableishment[]> {
    const estableishments: Estableishment[] =
      await this.estableishmentRepository.find({
        relations: ['district'],
      });
    if (estableishments.length === 0) {
      throw new NotFoundException('No se encontro datos de establecimientos');
    }
    return estableishments;
  }

  async findTicketsByDistReports(idDistrito: string, mesFiltro?: number, anioFiltro?: number): Promise<any[]> {
    const establecimientos = await this.estableishmentRepository.find({
      where: { district: { id: idDistrito } },
      relations: ['tickets', 'tickets.subcategory'],
    });
  
    const resultArray = establecimientos.flatMap(establecimiento => {
      const tickets = establecimiento.tickets.filter(ticket => {
        if (mesFiltro && anioFiltro) {
          const fechaCreacion = new Date(ticket.createdAt);
          return fechaCreacion.getMonth() === mesFiltro - 1 && fechaCreacion.getFullYear() === Number(anioFiltro);
        }
        return true;
      });
  
      const subcategoriasConTickets = tickets.reduce((result, ticket) => {
        const subcategoria = ticket.subcategory;
  
        if (!result[subcategoria.id]) {
          result[subcategoria.id] = {
            subcategoria: subcategoria.nombre,
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
  
        result[subcategoria.id].totalTickets++;
        if (ticket.estado === ESTADOS.ABIERTO) {
          result[subcategoria.id].ticketsAbiertos++;
        } else if (ticket.estado === ESTADOS.EN_PROCESO) {
          result[subcategoria.id].ticketsEnProceso++;
        } else if (ticket.estado === ESTADOS.CERRADO) {
          result[subcategoria.id].ticketsCerrados++;
          const tiempoOcupado = ticket.tiempoOcupado;
          const tiempoSubcategoria = ticket.subcategory.tiempo;
  
          if (tiempoSubcategoria - tiempoOcupado >= 0) {
            result[subcategoria.id].ticketsATiempo++;
          } else {
            result[subcategoria.id].ticketsAtrasados++;
          }
        }
        switch (ticket.satisfaccion) {
          case SATISFACCION.N_S:
            result[subcategoria.id].ticketsNS++;
            break;
          case SATISFACCION.P_S:
            result[subcategoria.id].ticketsAS++;
            break;
          case SATISFACCION.S:
            result[subcategoria.id].ticketsS++;
            break;
          case SATISFACCION.M_S:
            result[subcategoria.id].ticketsMS++;
            break;
        }
        switch (ticket.a_oportuna) {
          case OPORTUNO.SI:
            result[subcategoria.id].ticketsOportuno++;
            break;
          case OPORTUNO.NO:
            result[subcategoria.id].ticketsNoOportuno++;
            break;
        }
        switch (ticket.s_problema) {
          case S_PROBLEMA.SI:
            result[subcategoria.id].ticketsSolucionado++;
            break;
          case S_PROBLEMA.NO:
            result[subcategoria.id].ticketsNoSolucionado++;
            break;
        }
  
        return result;
      }, {});
  
      return Object.values(subcategoriasConTickets);
    });
  
    const totalRow = resultArray.reduce((acc, curr) => {
      Object.keys(curr).forEach(key => {
        if (key !== 'subcategoria') {
          acc[key] = (acc[key] || 0) + curr[key];
        }
      });
      return acc;
    }, { subcategoria: 'TOTAL' });
  
    resultArray.push(totalRow);
  
    return resultArray;
  }

  async findTicketsByEstReports(idEstablecimiento: string, mesFiltro?: number, anioFiltro?: number): Promise<any[]> {
    const establecimiento = await this.estableishmentRepository.findOne({
      where: {id: idEstablecimiento},
      relations: ['tickets', 'tickets.subcategory'],
    });

    if (!establecimiento) {
      throw new NotFoundException('No se encontró el establecimiento');
    }
    const tickets = establecimiento.tickets.filter(ticket => {
      if (mesFiltro && anioFiltro) {
        const fechaCreacion = new Date(ticket.createdAt);
        return fechaCreacion.getMonth() === mesFiltro - 1 && fechaCreacion.getFullYear() === Number(anioFiltro);
      }
      return true;
    });

    const subcategoriasConTickets = tickets.reduce((result, ticket) => {
      const subcategoria = ticket.subcategory;
      if (!result[subcategoria.id]) {
        result[subcategoria.id] = {
          subcategoria: subcategoria.nombre,
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

      result[subcategoria.id].totalTickets++;
      if (ticket.estado === ESTADOS.ABIERTO) {
        result[subcategoria.id].ticketsAbiertos++;
      } else if (ticket.estado === ESTADOS.EN_PROCESO) {
        result[subcategoria.id].ticketsEnProceso++;
      } else if (ticket.estado === ESTADOS.CERRADO) {
        result[subcategoria.id].ticketsCerrados++;
        const tiempoOcupado = ticket.tiempoOcupado;
        const tiempoSubcategoria = ticket.subcategory.tiempo;

        if (tiempoSubcategoria - tiempoOcupado >= 0) {
          result[subcategoria.id].ticketsATiempo++;
        } else {
          result[subcategoria.id].ticketsAtrasados++;
        }
      }
      switch (ticket.satisfaccion) {
        case SATISFACCION.N_S:
          result[subcategoria.id].ticketsNS++;
          break;
        case SATISFACCION.P_S:
          result[subcategoria.id].ticketsAS++;
          break;
        case SATISFACCION.S:
          result[subcategoria.id].ticketsS++;
          break;
        case SATISFACCION.M_S:
          result[subcategoria.id].ticketsMS++;
          break;
      }

      switch (ticket.a_oportuna) {
        case OPORTUNO.SI:
          result[subcategoria.id].ticketsOportuno++;
          break;
        case OPORTUNO.NO:
          result[subcategoria.id].ticketsNoOportuno++;
          break;
      }
      switch (ticket.s_problema) {
        case S_PROBLEMA.SI:
          result[subcategoria.id].ticketsSolucionado++;
          break;
        case S_PROBLEMA.NO:
          result[subcategoria.id].ticketsNoSolucionado++;
          break;
      }

      return result;
    }, {});

    const totalRow = Object.values(subcategoriasConTickets).reduce((acc, curr) => {
      Object.keys(curr).forEach(key => {
        if (key !== 'subcategoria') {
          acc[key] = (acc[key] || 0) + curr[key];
        }
      });
      return acc;
    }, { subcategoria: 'TOTAL' });
    const resultArray = [...Object.values(subcategoriasConTickets), totalRow];
  
    return resultArray;
  }

  async Count(): Promise<{ totalCountEstableishments: number }> {
    const totalCountEstableishments =
      await this.estableishmentRepository.count();
    return { totalCountEstableishments };
  }

  async findOneEstableishment(id: string): Promise<Estableishment> {
    const estableishment: Estableishment =
      await this.estableishmentRepository.findOne({
        where: {
          id,
        },
        relations: ['district', 'tickets'],
      });
    if (!estableishment) {
      throw new NotFoundException('El establecimiento no fue encontrado');
    }
    return estableishment;
  }

  async updateEstableishment(
    id: string,
    body: UpdateEstableishmentDto,
  ): Promise<UpdateResult | undefined> {
    const estableishmentFound = await this.estableishmentRepository.findOne({
      where: {
        id,
      },
    });
    if (!estableishmentFound) {
      throw new NotFoundException('No existe el establecimiento');
    }

    const district = await this.districtService.findOneDistrict(body.district)
    if (!district) {
      throw new BadRequestException(
        'No existe el distrito ingresado',
      );
    }

    const estableishment: UpdateResult =
      await this.estableishmentRepository.update(id, {...body, district});
    if (estableishment.affected === 0) {
      throw new BadRequestException('No se pudo actualizar el establecimiento');
    }
    return estableishment;
  }

  async removeEstableishment(id: string) {
    const estableishment = await this.findOneEstableishment(id);
    if (!estableishment) {
      throw new BadRequestException('No existe el establecimiento');
    }
    await this.estableishmentRepository.remove(estableishment);
  }
}
