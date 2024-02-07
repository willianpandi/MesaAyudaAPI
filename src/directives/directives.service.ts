import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult, DeleteResult } from 'typeorm';

import { DirectiveDto, UpdateDirectiveDto } from './dto/directive.dto';
import { Directive } from './entities/directive.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class DirectivesService {
  constructor(
    @InjectRepository(Directive)
    private readonly directiveRepository: Repository<Directive>,
  ) {}

  async createDirective(body: DirectiveDto): Promise<Directive> {
    const directiveFound = await this.directiveRepository.findOne({
      where: {
        nombre: body.nombre,
      },
    });
    if (directiveFound) {
      throw new BadRequestException(
        'Ya existe la directiva con el nombre ingresado',
      );
    }
    return await this.directiveRepository.save(body);
  }

  async findAllDirectives(): Promise<Directive[]> {
    const directives: Directive[] = await this.directiveRepository.find({
      relations: ['tickets'],
    });
    if (directives.length === 0) {
      throw new NotFoundException('No se encontro datos de directivas');
    }
    return directives;
  }

  async Count(): Promise<{ totalCountDirectives: number }> {
    const totalCountDirectives = await this.directiveRepository.count();
    return { totalCountDirectives };
  }

  async findOneDirective(id: string): Promise<Directive> {
    const directive: Directive = await this.directiveRepository.findOne({
      where: {
        id,
      },
      relations: ['tickets'],
    });
    if (!directive) {
      throw new NotFoundException('La directiva no fue encontrado');
    }
    return directive;
  }

  async updateDirective(
    id: string,
    body: UpdateDirectiveDto,
  ): Promise<UpdateResult> {
    const directiveFound = this.directiveRepository.findOne({
      where: {
        id,
      },
    });
    if (!directiveFound) {
      throw new NotFoundException('No existe la directiva');
    }

    const directive: UpdateResult = await this.directiveRepository.update(
      id,
      body,
    );
    if (directive.affected === 0) {
      throw new BadRequestException('No se pudo actualizar la directiva');
    }
    return directive;
  }

  async removeDirective(id: string): Promise<DeleteResult> {
    const directive: DeleteResult = await this.directiveRepository.delete(id);
    if (directive.affected === 0) {
      throw new BadRequestException('No se pudo eliminar la directiva');
    }
    return directive;
  }
}
