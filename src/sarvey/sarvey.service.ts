import { Injectable } from '@nestjs/common';
import { SarveyDto, UpdateSarveyDto } from './dto/create-sarvey.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { Sarvey } from './entities/sarvey.entity';
import { Ticket } from 'src/tickets/entities/ticket.entity';
import { ErrorManager } from 'src/config/error-manage';

@Injectable()
export class SarveyService {

  constructor(
    @InjectRepository(Sarvey) private readonly sarveyRespository: Repository<Sarvey>,
    @InjectRepository(Ticket) private readonly ticketRespository: Repository<Ticket>,
  ){}

  async createSarvey(id: string, body: SarveyDto) {
  try {
    const ticketFound: Ticket = await this.ticketRespository.findOne({
      where: {
        id,
      }
    });
    if (!ticketFound) {
      throw new ErrorManager({
       type: 'BAD_REQUEST',
        message: 'No existe el ticket',
      });
    }
    const newSarvey = this.sarveyRespository.create(body);
    const savedSarvey = await this.sarveyRespository.save(newSarvey);
    ticketFound.sarvey = savedSarvey;
    return this.ticketRespository.save(ticketFound);
  } catch (error) {
    throw ErrorManager.createSignatureError(error.message);
  }
  }

  async findAllSarveys():Promise<Sarvey[]> {
    try {
      const sarveys: Sarvey[] = await this.sarveyRespository.find();
      if (sarveys.length === 0) {
        throw new ErrorManager({
         type: 'BAD_REQUEST',
          message: 'No se encuentra datos de las encuestas de satisfaccion',
        });
      }
      return sarveys;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  async findOneSarvey(id: string): Promise<Sarvey> {
    try {
      const sarvey: Sarvey = await this.sarveyRespository.findOne({
        where:{
          id,
        }
      });
      if (!sarvey) {
        throw new ErrorManager({
         type: 'BAD_REQUEST',
          message: 'No existe el ticket',
        });
      }
      return sarvey;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  async updateSarvey(id: string, body: UpdateSarveyDto): Promise<UpdateResult> {
    try {
      const sarveyFound: Sarvey = await this.sarveyRespository.findOne({
        where: {
          id,
        }
      });
      if (!sarveyFound) {
        throw new ErrorManager({
         type: 'BAD_REQUEST',
          message: 'No existe el ticket',
        });
      }

      const sarvey: UpdateResult = await this.sarveyRespository.update(id, body);
      if (sarvey.affected === 0) {
        throw new ErrorManager({
         type: 'BAD_REQUEST',
          message: 'No se pudo actualizar la encuesta de satisfaccion del ticket',
        });
      }
      return sarvey;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  // async removeSarvey(id: string) {
   
  // }
}
