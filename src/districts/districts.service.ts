import { Injectable } from '@nestjs/common';
import { DistrictDto, UpdateDistrictDto } from './dto/district.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { District } from './entities/district.entity';
import { ErrorManager } from 'src/config/error-manage';

@Injectable()
export class DistrictsService {
  constructor(
    @InjectRepository(District)
    private readonly districtRepository: Repository<District>,
  ) {}

  async createDistrict(body: DistrictDto): Promise<District> {
    try {
      const districtFound = await this.districtRepository.findOne({
        where: {
          codigo: body.codigo,
        },
      });
      if (districtFound) {
        throw new ErrorManager({
         type: 'BAD_REQUEST',
          message: 'El distrito ya existe',
        });
      }
      return this.districtRepository.save(body);
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  async findAllDistricts(): Promise<District[]> {
    try {
      const districts: District[] = await this.districtRepository.find({
        relations: ['estableishments'],
      });
      if (districts.length === 0) {
        throw new ErrorManager({
         type: 'BAD_REQUEST',
          message: 'No se encontro datos de Distritos',
        });
      }
      return districts;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  async findOneDistrict(id: string): Promise<District> {
    try {
      const district: District = await this.districtRepository.findOne({
        where: {
          id,
        },
        relations: ['estableishments'],
      });
      if (!district) {
        throw new ErrorManager({
         type: 'BAD_REQUEST',
          message: 'El distrito no existe',
        });
      }
      return district;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  async updateDistrict(
    id: string,
    body: UpdateDistrictDto,
  ): Promise<UpdateResult> {
    try {
      const districtFound = await this.districtRepository.findOne({
        where: {
          id,
        },
      });
      if (!districtFound) {
        throw new ErrorManager({
         type: 'BAD_REQUEST',
          message: 'El distrito no existe',
        });
      }
      const district: UpdateResult = await this.districtRepository.update(
        id,
        body,
      );
      if (district.affected === 0) {
        throw new ErrorManager({
         type: 'BAD_REQUEST',
          message: 'No se pudo actualizar el distrito',
        });
      }
      return district;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  async removeDistrict(id: string) {
    try {
      const district: DeleteResult = await this.districtRepository.delete(id);
      if (district.affected === 0) {
        throw new ErrorManager({
         type: 'BAD_REQUEST',
          message: 'No se pudo eliminar el distrito',
        });
      }
      return district;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }
}
