import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import * as bcryptjs from "bcryptjs";

import { LoginDto, ProfileDto, RegisterUserDto, UpdateUserDto, UserDto } from './dto/user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { User } from './entities/user.entity';
import { ErrorManager } from 'src/config/error-manage';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload';
import { LoginResponse } from './interfaces/login-response';
import { EstableishmentsService } from 'src/estableishments/estableishments.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private  estableishmentService: EstableishmentsService,

    private jwtService: JwtService,
  ) {}

  
  async createUser(body: UserDto) {
    try {
      const userFound = await this.userRepository.findOne({
        where: {
          usuario: body.usuario,
        },
      });

      if (userFound) {
        throw new ErrorManager({
         type: 'BAD_REQUEST',
          message: 'El usuario ya existe',
        });
      }

      const { contrasenia, ...userDta } = body;

      const newUser = await this.userRepository.create({
        contrasenia: bcryptjs.hashSync( contrasenia, 10),
        ...userDta
      })

      return await this.userRepository.save(newUser);
      // return await this.userRepository.save(body);
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  async register( body: RegisterUserDto){

    try {
      const userFound = await this.userRepository.findOne({
        where: {
          usuario: body.usuario,
        },
      });
  
      if (userFound) {
        throw new ErrorManager({
          type: 'BAD_REQUEST',
          message: 'El usuario ya existe',
        });
        // throw new BadRequestException(`El usuario: ${ body.usuario } ya existe!`)
      }
  
      const { contrasenia, ...userDta } = body;
  
      const newUser = await this.userRepository.create({
        contrasenia: bcryptjs.hashSync( contrasenia, 10),
        ...userDta
      })
  
      // await this.userRepository.save(newUser);
      
      const user = await this.userRepository.save( newUser );
  
      return {
        user: user,
        token: this.getJwtToken({id: user.id })
      }
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
      // throw new InternalServerErrorException(`Algo terrible paso!!!`)
    }
  }

  async login(body: LoginDto): Promise<LoginResponse>{

    try {
      const { usuario, contrasenia } = body;

    const user = await this.userRepository.findOne({
      where: {
        usuario,
      }
    })
    if (!user) {
      throw new ErrorManager({
       type: 'BAD_REQUEST',
        message: 'Credeciales no validas, usuario',
      }); 
    }
    
    if (!bcryptjs.compareSync( contrasenia, user.contrasenia)) {
      throw new ErrorManager({
       type: 'BAD_REQUEST',
        message: 'Credeciales no validas, contrasenia',
      }); 
    }

    return {
      user, 
      token: this.getJwtToken({ id: user.id }),
    }
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }

  }


  // async createProfile(id: string, body: ProfileDto) {
  //   try {
  //     const estableishmentFound =
  //       await this.estableishmentService.findOneEstableishment(id);
  //     if (!estableishmentFound) {
  //       throw new ErrorManager({
  //        type: 'BAD_REQUEST',
  //         message: 'No existe el establecimiento',
  //       });
  //     }
  //     const newProfile = this.userRepository.create({
  //       ...body,
  //       estableishment: estableishmentFound,
  //     });
  //     const savedProfile = await this.userRepository.save(newProfile);
  //     return await this.userRepository.save(savedProfile);
  //   } catch (error) {
  //     throw ErrorManager.createSignatureError(error.message);
  //   }
  // }

  async findAllUsers(): Promise<User[]> {
    try {
      const users: User[] = await this.userRepository.find({
        relations: [
          'estableishment',
          'estableishment.district',
        ],
      });
      if (users.length === 0) {
        throw new ErrorManager({
          type: 'NOT_FOUND',
          message: 'No se encontro datos de Usuarios',
        });
      }
      return users;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  async findOneUser(id: string): Promise<User> {
    try {
      const user: User = await this.userRepository.findOne({
        where: {
          id,
        },
        relations: [
          'estableishment',
          'estableishment.district',
        ],
      });
      if (!user) {
        throw new ErrorManager({
          type: 'NOT_FOUND',
          message: 'No existe el usuario',
        });
      }

      return user;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  async updateUser(id: string, body: UpdateUserDto): Promise<UpdateResult> {
    try {
      const userFound = await this.userRepository.findOne({
        where: {
          id,
        },
      });
      if (!userFound) {
        throw new ErrorManager({
         type: 'BAD_REQUEST',
          message: 'No existe el usuario',
        });
      }

      const user: UpdateResult = await this.userRepository.update(id, body);
      if (user.affected === 0) {
        throw new ErrorManager({
         type: 'BAD_REQUEST',
          message: 'No se pudo actualizar el usuario',
        });
      }
      return user;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  // async updateProfile(id: string, body: UpdateProfileDto) {
  //   try {
  //     const profileFound: User = await this.userRepository.findOne({
  //       where: {
  //         id,
  //       },
  //     });
  //     if (!profileFound) {
  //       throw new ErrorManager({
  //        type: 'BAD_REQUEST',
  //         message: 'No existe el perfile del usuario',
  //       });
  //     }

  //     const profile: UpdateResult = await this.userRepository.update(
  //       id,
  //       body,
  //     );
  //     if (profile.affected === 0) {
  //       throw new ErrorManager({
  //        type: 'BAD_REQUEST',
  //         message: 'No se pudo actualizar el perfil de usuario',
  //       });
  //     }
  //     return profile;
  //   } catch (error) {
  //     throw ErrorManager.createSignatureError(error.message);
  //   }
  // }

  async removeUser(id: number): Promise<DeleteResult> {
    try {
      const user: DeleteResult = await this.userRepository.delete(id);
      if (user.affected === 0) {
        throw new ErrorManager({
         type: 'BAD_REQUEST',
          message: 'No se pudo eliminar el usuario',
        });
      }
      return user;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  getJwtToken(payload : JwtPayload){
    const token = this.jwtService.sign(payload);
    return token;
  }
}
