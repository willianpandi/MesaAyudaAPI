import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { UsersService } from '../users.service';
import { JwtPayload } from '../interfaces/jwt-payload';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private jwtService: JwtService,
    private authService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext ): Promise<boolean>{

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader( request );
    
    if (!token) {
      throw new UnauthorizedException('No existe un token');
    }

    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(
        token,{ secret: `.${process.env.NODE_ENV}.env` }
      );

      const user = await this.authService.findOneUser( payload.id );
      if ( !user ) { throw new UnauthorizedException( 'Este usuario no existe ') };
      if ( !user.estado ) { throw new UnauthorizedException( 'Este usuario esta inactivo ') };
      
      request['user'] = user;
    } catch (error) {
      throw new UnauthorizedException();
    }


    return true;
  }

  private extractTokenFromHeader( request: Request ): string | undefined {
    const [ type, token ] = request.headers['authorization']?.split(' ') ?? [];
    return type === 'Bearer' ? token:undefined;
  }
}
