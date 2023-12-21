import { Injectable } from '@nestjs/common';
import { EstableishmentDto, UpdateEstableishmentDto } from './dto/estableishment.dto';
import { Estableishment } from './entities/estableishment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { ErrorManager } from 'src/config/error-manage';
import { DistrictsService } from 'src/districts/districts.service';

@Injectable()
export class EstableishmentsService {

  constructor(
    @InjectRepository(Estableishment) private readonly estableishmentRepository: Repository<Estableishment>,
    private districtService : DistrictsService,
  ){}

  async createEstableishment(body: EstableishmentDto): Promise<Estableishment> {
    try {
      const EstableishFound = await this.estableishmentRepository.findOne({
        where: {
          codigo: body.codigo,
        },
      });
      if (EstableishFound) {
        throw new ErrorManager({
          type:'BAD_REQUEST',
          message: 'El establecimiento ya existe'
        })
      }
      return await this.estableishmentRepository.save(body);
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  async findAllEstableishments(): Promise<Estableishment[]> {
    try {
      const estableishments: Estableishment[] = await this.estableishmentRepository.find({
        relations: ['district'],
      });
      if (estableishments.length === 0) {
        throw new ErrorManager({
          type:'BAD_REQUEST',
          message: 'No se encontro datos de Establecimientos'
        })
      }
      return estableishments;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  async findOneEstableishment(id: string): Promise<Estableishment> {
   try {
    const estableishment: Estableishment = await this.estableishmentRepository.findOne({
      where: {
        id,
      }, 
      relations: ['district'],
    });
    if (!estableishment) {
      throw new ErrorManager({
       type: 'BAD_REQUEST',
        message: 'No existe el Establecimiento',
      });
    }
    return estableishment;
   } catch (error) {
    throw ErrorManager.createSignatureError(error.message);
   }
  }

  async updateEstableishment(id: string, body: UpdateEstableishmentDto): Promise<UpdateResult | undefined> {
    try {
      const estableishmentFound = await this.estableishmentRepository.findOne({
        where: {
          id,
        }, 
      });
      if (!estableishmentFound) {
        throw new ErrorManager({
         type: 'BAD_REQUEST',
          message: 'No existe el Establecimiento',
        });
      }
      const estableishment: UpdateResult = await this.estableishmentRepository.update(id, body);
      if (estableishment.affected === 0 ) {
        throw new ErrorManager({
         type: 'BAD_REQUEST',
          message: 'No se pudo actualizar el establecimiento',
        });
      }
      return estableishment;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  async removeEstableishment(id: string): Promise<DeleteResult | undefined> {
    try {
      const estableishment: DeleteResult = await this.estableishmentRepository.delete(id);
      if (estableishment.affected === 0) {
        throw new ErrorManager({
         type: 'BAD_REQUEST',
          message: 'No se pudo eliminar el establecimiento',
        });
      }
      return estableishment;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }
}
