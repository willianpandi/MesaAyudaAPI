import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateSubCategoryDto, UpdateSubCategoryDto } from './dto/sub-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { SubCategory } from './entities/sub-category.entity';
import { Repository, UpdateResult } from 'typeorm';
import { CategoriesService } from '../categories/categories.service';
import { ESTADOS, OPORTUNO, SATISFACCION, S_PROBLEMA } from '../constants/opcions';

@Injectable()
export class SubCategoryService {

  constructor(
    @InjectRepository(SubCategory)
    private readonly subCategoryRepository: Repository<SubCategory>,
    private readonly categoryService: CategoriesService,
  ) {}

  async create(body: CreateSubCategoryDto) {
    const subCategoryFound = await this.subCategoryRepository.findOne({
      where: {
        nombre: body.nombre,
      },
    });
    if (subCategoryFound) {
      throw new BadRequestException(
        'Ya existe una sub-categoria con el nombre ingresado',
      );
    }
    const category = await this.categoryService.findOneCategory(body.category)
    if (!category) {
      throw new BadRequestException(
        'No existe la categoria ingresado',
      );
    }
    return await this.subCategoryRepository.save({...body, category, createdAt: new Date(),updateAt: new Date()});
  }

  async findAllSubCategories(): Promise<SubCategory[]> {
    const subcategories: SubCategory[] = await this.subCategoryRepository.find({
      relations: ['category']
    });
    if (subcategories.length === 0) {
      throw new NotFoundException('No se encontro datos de sub-categorias de ayuda');
    }
    return subcategories;
  }

  async findSubCategoryReports(mesFiltro?: number, anioFiltro?: number): Promise<any> {
    const subcategory: SubCategory[] = await this.subCategoryRepository.find({
      relations: ['tickets'],
    });

    const subCategoriasConTickets = subcategory.map(subcategoria => {
      const filteredTickets = subcategoria.tickets.filter(ticket => {
        if (!mesFiltro && !anioFiltro) {
          return true;
        }
        const fechaCreacion = new Date(ticket.createdAt);
        return fechaCreacion.getMonth() === mesFiltro - 1 && fechaCreacion.getFullYear() === Number(anioFiltro);
      });

      const tiempoAsignado = subcategoria.tiempo || 0;
      const ticketsTiempo = filteredTickets.filter(ticket => {
        if (ticket.estado === ESTADOS.CERRADO) {
          return (tiempoAsignado - ticket.tiempoOcupado) >= 0;
        }
        return false;
      });       
      const ticketsCont = filteredTickets.filter(ticket => ticket.estado === ESTADOS.CERRADO);      

      return {
        subcategoria: subcategoria.nombre,
        totalTickets: filteredTickets.length,
        ticketsAbiertos: filteredTickets.filter(ticket => ticket.estado === ESTADOS.ABIERTO).length,
        ticketsEnProceso: filteredTickets.filter(ticket => ticket.estado === ESTADOS.EN_PROCESO).length,
        ticketsCerrados: filteredTickets.filter(ticket => ticket.estado === ESTADOS.CERRADO).length,
        ticketsNS: filteredTickets.filter(ticket => ticket.satisfaccion === SATISFACCION.N_S).length,
        ticketsAS: filteredTickets.filter(ticket => ticket.satisfaccion === SATISFACCION.P_S).length,
        ticketsS: filteredTickets.filter(ticket => ticket.satisfaccion === SATISFACCION.S).length,
        ticketsMS: filteredTickets.filter(ticket => ticket.satisfaccion === SATISFACCION.M_S).length,
        ticketsATiempo: ticketsTiempo.length,
        ticketsAtrasados: ticketsCont.length - ticketsTiempo.length,
        ticketsOportuno: filteredTickets.filter(ticket => ticket.a_oportuna === OPORTUNO.SI).length,
        ticketsNoOportuno: filteredTickets.filter(ticket => ticket.a_oportuna === OPORTUNO.NO).length,
        ticketsSolucionado: filteredTickets.filter(ticket => ticket.s_problema === S_PROBLEMA.SI).length,
        ticketsNoSolucionado: filteredTickets.filter(ticket => ticket.s_problema === S_PROBLEMA.NO).length,
      }        
    });

    const totalRow = {
      subcategoria: 'TOTAL',
      totalTickets: subCategoriasConTickets.reduce((acc, curr) => acc + curr.totalTickets, 0),
      ticketsAbiertos: subCategoriasConTickets.reduce((acc, curr) => acc + curr.ticketsAbiertos, 0),
      ticketsEnProceso: subCategoriasConTickets.reduce((acc, curr) => acc + curr.ticketsEnProceso, 0),
      ticketsCerrados: subCategoriasConTickets.reduce((acc, curr) => acc + curr.ticketsCerrados, 0),
      ticketsNS: subCategoriasConTickets.reduce((acc, curr) => acc + curr.ticketsNS, 0),
      ticketsAS: subCategoriasConTickets.reduce((acc, curr) => acc + curr.ticketsAS, 0),
      ticketsS: subCategoriasConTickets.reduce((acc, curr) => acc + curr.ticketsS, 0),
      ticketsMS: subCategoriasConTickets.reduce((acc, curr) => acc + curr.ticketsMS, 0),
      ticketsATiempo: subCategoriasConTickets.reduce((acc, curr) => acc + curr.ticketsATiempo, 0),
      ticketsAtrasados: subCategoriasConTickets.reduce((acc, curr) => acc + curr.ticketsAtrasados, 0),
      ticketsOportuno: subCategoriasConTickets.reduce((acc, curr) => acc + curr.ticketsOportuno, 0),
      ticketsNoOportuno: subCategoriasConTickets.reduce((acc, curr) => acc + curr.ticketsNoOportuno, 0),
      ticketsSolucionado: subCategoriasConTickets.reduce((acc, curr) => acc + curr.ticketsSolucionado, 0),
      ticketsNoSolucionado: subCategoriasConTickets.reduce((acc, curr) => acc + curr.ticketsNoSolucionado, 0),
    };
  
    subCategoriasConTickets.push(totalRow);
    return subCategoriasConTickets;
  }

    
  async findOneSubCategory(id: string): Promise<SubCategory> {
    const subcategory: SubCategory = await this.subCategoryRepository.findOne({
      where: {
        id,
      },
    });
    if (!subcategory) {
      throw new NotFoundException('La sub-categoria no fue encontrado');
    }
    return subcategory;
  }

  async updateSubCategory(
    id: string,
    body: UpdateSubCategoryDto,
  ): Promise<UpdateResult> {
    const subCategoryFound = this.subCategoryRepository.findOne({
      where: {
        id,
      },
    });
    if (!subCategoryFound) {
      throw new NotFoundException('No existe la sub-categoria');
    }

    const category = await this.categoryService.findOneCategory(body.category)
    if (!category) {
      throw new BadRequestException(
        'No existe la categoria ingresado',
      );
    }
    const subcategory: UpdateResult = await this.subCategoryRepository.update(
      id,
      {...body, category, updateAt: new Date()}
    );
    if (subcategory.affected === 0) {
      throw new BadRequestException('No se pudo actualizar la sub-categoria');
    }
    return subcategory;
  }

  async removeSubCategory(id: string) {
    const subcategory = await this.findOneSubCategory(id);
    if (!subcategory) {
      throw new BadRequestException('No existe el ticket');
    }
    await this.subCategoryRepository.remove(subcategory);
  }

}
