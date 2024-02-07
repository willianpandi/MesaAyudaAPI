import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';

import {
  EstableishmentDto,
  UpdateEstableishmentDto,
} from './dto/estableishment.dto';
import { Estableishment } from './entities/estableishment.entity';

@Injectable()
export class EstableishmentsService {
  constructor(
    @InjectRepository(Estableishment)
    private readonly estableishmentRepository: Repository<Estableishment>,
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
    return await this.estableishmentRepository.save(body);
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
        relations: ['district'],
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
    const estableishment: UpdateResult =
      await this.estableishmentRepository.update(id, body);
    if (estableishment.affected === 0) {
      throw new BadRequestException('No se pudo actualizar el establecimiento');
    }
    return estableishment;
  }

  async removeEstableishment(id: string): Promise<DeleteResult | undefined> {
    const estableishment: DeleteResult =
      await this.estableishmentRepository.delete(id);
    if (estableishment.affected === 0) {
      throw new BadRequestException('No se pudo eliminar el establecimiento');
    }
    return estableishment;
  }
}
