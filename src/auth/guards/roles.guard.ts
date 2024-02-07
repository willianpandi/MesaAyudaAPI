import { BadRequestException, CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector, 
  ) {}
  canActivate(
    context: ExecutionContext,
  ): boolean {

    const validRol:string[] = this.reflector.get(ROLES_KEY,
      context.getHandler(),
    )
    if (!validRol) return true;


    const { user } = context.switchToHttp().getRequest();


    if (!user) throw new BadRequestException('Usuario no encontrado');

    if ( validRol.includes(user.rol)) {
      return true;
    } else {
      throw new ForbiddenException(
        `EL usuario ${ user.rol } no tiene un rol valido: [ ${ validRol }]`
      );
    }

  }
}
