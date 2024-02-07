import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcryptjs from 'bcryptjs';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';


import { UpdateUserDto, UpdateUserPassword, UserDto } from './dto/user.dto';
import { User } from './entities/user.entity';
import { ROLES } from 'src/constants/opcions';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async createUser(body: UserDto) {
    const userFound = await this.userRepository.findOne({
      where: {
        usuario: body.usuario,
      },
    });

    if (userFound) {
      throw new BadRequestException(
        'Ya existe un usuario con número de cédula ingresado',
      );
    }

    const { contrasenia, ...userDta } = body;

    const newUser = await this.userRepository.create({
      contrasenia: bcryptjs.hashSync(contrasenia, 10),
      ...userDta,
    });

    return await this.userRepository.save(newUser);
  }

  async findAllUsers(): Promise<User[]> {
    const users: User[] = await this.userRepository.find({
      relations: ['estableishment', 'estableishment.district'],
    });

    if (users.length === 0) {
      throw new NotFoundException('No se encontro datos de usuarios');
    }

    return users;
  }

  async findSoporteUsers(userr: User): Promise<User[]> {
    if (userr.rol === ROLES.ADMINISTRADOR) {
      const users: User[] = await this.userRepository.find({
        where: { rol: ROLES.SOPORTE },
        relations: ['estableishment', 'estableishment.district'],
      });
      if (users.length === 0) {
        throw new NotFoundException('No se encontraron usuarios soportes');
      }

      return users;
    } else {
      let whereClausula: any[] = [
        {
          rol: ROLES.SOPORTE,
          estableishment: { id: userr.estableishment.id },
        },
      ];

      const EstablecimientoUsers = await this.userRepository.find({
        where: {
          rol: ROLES.SOPORTE,
          estableishment: { id: userr.estableishment.id },
        },
      });

      if (EstablecimientoUsers.length === 0) {
        whereClausula.push({
          rol: ROLES.SOPORTE,
          estableishment: {
            district: { id: userr.estableishment.district.id },
          },
        });
      }

      const users: User[] = await this.userRepository.find({
        where: whereClausula,
        relations: ['estableishment', 'estableishment.district'],
      });

      if (users.length === 0) {
        throw new NotFoundException(
          'No se encontraron usuarios con el rol SOPORTE en el mismo distrito o establecimiento',
        );
      }

      return users;
    }
  }

  async Count(): Promise<{ totalCountUsers: number }> {
    const totalCountUsers = await this.userRepository.count();   
    return { totalCountUsers };
  }

  async findOneUser(id: string): Promise<User> {
    const user: User = await this.userRepository.findOne({
      where: {
        id,
      },
      relations: ['estableishment', 'estableishment.district'],
    });
    if (!user) {
      throw new NotFoundException('El usuario no fue encontrado');
    }
    return user;
  }

  async updateUser(
    id: string,
    body: UpdateUserDto,
    userr: User,
  ): Promise<UpdateResult> {
    const userFound = await this.userRepository.findOne({
      where: {
        id,
      },
    });
    if (!userFound) {
      throw new NotFoundException('No existe el usuario');
    }

    if (userr.rol === ROLES.ADMINISTRADOR) {
      const user: UpdateResult = await this.userRepository.update(id, body);
      if (user.affected === 0) {
        throw new BadRequestException('No se pudo actualizar el usuario');
      }

      return user;
    } else if (userr.id !== id) {
      throw new UnauthorizedException(
        'No puede actualizar, no tiene privilegios para realizar esta accion',
      );
    }

    const user: UpdateResult = await this.userRepository.update(id, body);
    if (user.affected === 0) {
      throw new BadRequestException('No se pudo actualizar el usuario');
    }
    return user;
  }

  async updatePassword(userr: User, body: UpdateUserPassword):  Promise<UpdateResult> {

    const userFound = await this.findOneUser(userr.id);
    if (!userFound) {
      throw new NotFoundException('Usuario no encontrado');
    }
    console.log({con: userr.contrasenia, conss: body.contrasenia});
    
    if (!bcryptjs.compareSync(body.contrasenia, userr.contrasenia)) {
      throw new BadRequestException(
        'Contraseña actual incorrecta',
      );
    }

    const hashedPassword = bcryptjs.hashSync(body.newContrasenia, 10);
  
    const user: UpdateResult = await this.userRepository.update(userr.id, {contrasenia: hashedPassword});
    if (user.affected === 0) {
      throw new BadRequestException('No se pudo actualizar el usuario');
    }
    return user;
  }

  async removeUser(id: number): Promise<DeleteResult> {
    const user: DeleteResult = await this.userRepository.delete(id);
    if (user.affected === 0) {
      throw new BadRequestException('No se pudo eliminar el usuario');
    }
    return user;
  }
}
