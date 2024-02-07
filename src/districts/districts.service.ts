import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';

import { DistrictDto, UpdateDistrictDto } from './dto/district.dto';
import { District } from './entities/district.entity';
import { Estableishment } from '../estableishments/entities/estableishment.entity';


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
    const districts: District[] = await this.districtRepository.find({
      relations: ['estableishments'],
    });
    if (districts.length === 0) {
      throw new NotFoundException('No se encontro datos de usuarios');
    }
    return districts;
  }

  async Count(): Promise<{ totalCountDistricts: number }> {
    const totalCountDistricts = await this.districtRepository.count();
    return { totalCountDistricts };
  }

  async findOneDistrict(id: string): Promise<Estableishment[]> {
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
    const district: DeleteResult = await this.districtRepository.delete(id);
    if (district.affected === 0) {
      throw new BadRequestException('No se pudo eliminar el distrito');
    }
    return district;
  }
}
