import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';

import { DistrictDto, UpdateDistrictDto } from './dto/district.dto';
import { District } from './entities/district.entity';
import { Estableishment } from '../estableishments/entities/estableishment.entity';
import { ESTADOS, OPORTUNO, SATISFACCION, S_PROBLEMA } from 'src/constants/opcions';


@Injectable()
export class DistrictsService {
  constructor(
    @InjectRepository(District)
    private readonly districtRepository: Repository<District>,
  ) {}

  async createDistrict(body: DistrictDto): Promise<District> {
    const districtFound = await this.districtRepository.findOne({
      where: {
        codigo: body.codigo,
      },
    });
    if (districtFound) {
      throw new BadRequestException(
        'Ya existe el distrito con el código ingresado',
      );
    }
    return this.districtRepository.save(body);
  }

  async findAllDistricts(): Promise<District[]> {
    const districts: District[] = await this.districtRepository.find();
    if (districts.length === 0) {
      throw new NotFoundException('No se encontro datos de usuarios');
    }
    return districts;
  }

  async Count(): Promise<{ totalCountDistricts: number }> {
    const totalCountDistricts = await this.districtRepository.count();
    return { totalCountDistricts };
  }

  async findOneDistrict(id: string): Promise<District> {
    const district: District = await this.districtRepository.findOne({
      where: {
        id,
      },
      // relations: ['estableishments'],
    });
    if (!district) {
      throw new NotFoundException('El distrito no fue encontrado');
    }
    return district;
  }

  async findEstableishmentByDistrict(id: string): Promise<Estableishment[]> {
    const district: District = await this.districtRepository.findOne({
      where: {
        id,
      },
      relations: ['estableishments'],
    });
    if (!district) {
      throw new NotFoundException('El distrito no fue encontrado');
    }
    return district.estableishments;
  }

  async findTicketsByEODReports(idDistrito: string, mesFiltro?: number, anioFiltro?: number): Promise<any[]> {
    const distrito = await this.districtRepository.findOne({
      where: { id: idDistrito },
      relations: ['estableishments', 'estableishments.tickets', 'estableishments.tickets.subcategory', 'estableishments.tickets.estableishment'],
    });
  
    if (!distrito) {
      throw new NotFoundException('No se encontró la EOD');
    }
  
    const tickets = distrito.estableishments.flatMap(establecimiento =>
      establecimiento.tickets.filter(ticket => {
        if (mesFiltro && anioFiltro) {
          const fechaCreacion = new Date(ticket.createdAt);
          return fechaCreacion.getMonth() === mesFiltro - 1 && fechaCreacion.getFullYear() === Number(anioFiltro);
        }
        return true;
      })
    );
      console.log(tickets);
      

    const establecimientosConTickets = tickets.reduce((result, ticket) => {
      const establecimiento = ticket.estableishment;
      
      if (!result[establecimiento.id]) {
        result[establecimiento.id] = {
          nombre: establecimiento.nombre,
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
  
      result[establecimiento.id].totalTickets++;
      if (ticket.estado === ESTADOS.ABIERTO) {
        result[establecimiento.id].ticketsAbiertos++;
      } else if (ticket.estado === ESTADOS.EN_PROCESO) {
        result[establecimiento.id].ticketsEnProceso++;
      } else if (ticket.estado === ESTADOS.CERRADO) {
        result[establecimiento.id].ticketsCerrados++;
        const tiempoOcupado = ticket.tiempoOcupado;
        const tiempoSubcategoria = ticket.subcategory.tiempo;

        if (tiempoSubcategoria - tiempoOcupado >= 0) {
          result[establecimiento.id].ticketsATiempo++;
        } else {
          result[establecimiento.id].ticketsAtrasados++;
        }
      }
      switch (ticket.satisfaccion) {
        case SATISFACCION.N_S:
          result[establecimiento.id].ticketsNS++;
          break;
        case SATISFACCION.P_S:
          result[establecimiento.id].ticketsAS++;
          break;
        case SATISFACCION.S:
          result[establecimiento.id].ticketsS++;
          break;
        case SATISFACCION.M_S:
          result[establecimiento.id].ticketsMS++;
          break;
      }
      switch (ticket.a_oportuna) {
        case OPORTUNO.SI:
          result[establecimiento.id].ticketsOportuno++;
          break;
        case OPORTUNO.NO:
          result[establecimiento.id].ticketsNoOportuno++;
          break;
      }
      switch (ticket.s_problema) {
        case S_PROBLEMA.SI:
          result[establecimiento.id].ticketsSolucionado++;
          break;
        case S_PROBLEMA.NO:
          result[establecimiento.id].ticketsNoSolucionado++;
          break;
      }

      return result;
    }, {});
  
    console.log(establecimientosConTickets);
    
    const totalRow = Object.values(establecimientosConTickets).reduce((acc, curr) => {
      Object.keys(curr).forEach(key => {
        if (key !== 'nombre') {
          acc[key] = (acc[key] || 0) + curr[key];
        }
      });
      return acc;
    }, { nombre: 'TOTAL' });
  
    const resultArray = [...Object.values(establecimientosConTickets), totalRow];
  
    return resultArray;
  }

  async updateDistrict(
    id: string,
    body: UpdateDistrictDto,
  ): Promise<UpdateResult> {
    const districtFound = await this.districtRepository.findOne({
      where: {
        id,
      },
    });
    if (!districtFound) {
      throw new NotFoundException('No existe el usuario');
    }
    const district: UpdateResult = await this.districtRepository.update(
      id,
      body,
    );
    if (district.affected === 0) {
      throw new BadRequestException('No se pudo actualizar el distrito');
    }
    return district;
  }

  async removeDistrict(id: string) {
    const district = await this.findOneDistrict(id);
    if (!district) {
      throw new BadRequestException('No existe el distrito');
    }
    await this.districtRepository.remove(district);
  }
}
