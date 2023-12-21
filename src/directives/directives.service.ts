import { Injectable } from '@nestjs/common';
import { DirectiveDto, UpdateDirectiveDto } from './dto/directive.dto';
import { ErrorManager } from 'src/config/error-manage';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult, DeleteResult } from 'typeorm';
import { Directive } from './entities/directive.entity';

@Injectable()
export class DirectivesService {
  constructor(
    @InjectRepository(Directive)
    private readonly directiveRepository: Repository<Directive>,
  ) {}

  async createDirective(body: DirectiveDto): Promise<Directive> {
    try {
      const directiveFound = await this.directiveRepository.findOne({
        where: {
          nombre: body.nombre,
        },
      });
      if (directiveFound) {
        throw new ErrorManager({
          type: 'NOT_FOUND',
          message: 'La directiva ya existe',
        });
      }
      return await this.directiveRepository.save(body);
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  async findAllDirectives(): Promise<Directive[]> {
    try {
      const directives: Directive[] = await this.directiveRepository.find({
        relations: ['tickets'],
      });
      // if (directives.length === 0) {
      //   throw new ErrorManager({
      //     type: 'NOT_FOUND',
      //     message: 'No se econtro datos de Directivas',
      //   });
      // }
      return directives;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  async findOneDirective(id: string): Promise<Directive> {
    try {
      const directive: Directive = await this.directiveRepository.findOne({
        where: {
          id,
        },
        relations: ['tickets'],
      });
      if (!directive) {
        throw new ErrorManager({
          type: 'NOT_FOUND',
          message: ' No existe la directiva',
        });
      }
      return directive;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  async updateDirective(
    id: string,
    body: UpdateDirectiveDto,
  ): Promise<UpdateResult> {
    try {
      const directiveFound = this.directiveRepository.findOne({
        where: {
          id,
        },
      });
      if (!directiveFound) {
        throw new ErrorManager({
          type: 'NOT_FOUND',
          message: 'La directiva no existe',
        });
      }

      const directive: UpdateResult = await this.directiveRepository.update(
        id,
        body,
      );
      if (directive.affected === 0) {
        throw new ErrorManager({
         type: 'BAD_REQUEST',
          message: 'No se pudo actualizar la directiva',
        });
      }
      return directive;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  async removeDirective(id: string): Promise<DeleteResult> {
    try {
      const directive: DeleteResult = await this.directiveRepository.delete(id);
      if (directive.affected === 0) {
        throw new ErrorManager({
         type: 'BAD_REQUEST',
          message: 'No se pudo eliminar la directiva',
        });
      }
      return directive;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }
}
