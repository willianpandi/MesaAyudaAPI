import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import * as bcryptjs from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload';

import { User } from '../users/entities/user.entity';
import { LoginDto } from './dto/create-auth.dto';
import { LoginResponse } from './interfaces/login-response';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async login(body: LoginDto): Promise<LoginResponse> {
    const { usuario, contrasenia } = body;
    const user = await this.userRepository.findOne({
      where: {
        usuario,
      },
    });

    if (!user) {
      throw new BadRequestException(
        'Usuario incorrecto.',
      );
    }

    if (!bcryptjs.compareSync(contrasenia, user.contrasenia)) {
      throw new BadRequestException(
        'Contraseña incorrecta.',
      );
    }

    if (!user.estado) {
      throw new ForbiddenException(
        'Lo sentimos. La cuenta a la que desea ingresar esta inactivo, comuniquese con el administrador',
      );
    }

    return {
      token: this.getJwtToken({ id: user.id }),
      user,
    };
  }

  getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }
}
