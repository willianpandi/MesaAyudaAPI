import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcryptjs from 'bcryptjs';
import { Repository, UpdateResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import {
  AddCategoryDto,
  AddEstableishmentDto,
  UpdateUserDto,
  UpdateUserPassword,
  UserDto,
} from './dto/user.dto';
import { User } from './entities/user.entity';
import { ESTADOS, OPORTUNO, ROLES, SATISFACCION, S_PROBLEMA } from '../constants/opcions';
import { EstableishmentsService } from '../estableishments/estableishments.service';
import { Estableishment } from '../estableishments/entities/estableishment.entity';
import { Category } from '../categories/entities/category.entity';
import { CategoriesService } from '../categories/categories.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly estableishmentService: EstableishmentsService,
    private readonly categoryService: CategoriesService,
    
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

    const newUser = this.userRepository.create({
      contrasenia: bcryptjs.hashSync(contrasenia, 10),
      ...userDta,
    });

    return await this.userRepository.save(newUser);
  }

  async findAllUsers(): Promise<User[]> {
    const users: User[] = await this.userRepository.find();

    if (users.length === 0) {
      throw new NotFoundException('No se encontro datos de usuarios');
    }
    return users;
  }

  async findAllUsersSupports(): Promise<User[]> {
    const users: User[] = await this.userRepository.find({
      where: {rol: ROLES.SOPORTE}
    });

    if (users.length === 0) {
      throw new NotFoundException('No se encontro datos de usuarios soporte');
    }
    return users;
  }

  async findTicketsByUser(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: [
        'categories',
        'categories.tickets',
        'categories.tickets.category',
        'categories.tickets.subcategory',
        'categories.tickets.estableishment',
      ],
    });

    const filteredTickets = user.categories.flatMap((category) =>
      category.tickets.filter(
        (ticket) => (!ticket.soporteReasignado || ticket.soporteReasignado === '')&&(ticket.soporteAsignado === user.nombre),
      ),
    );
    return filteredTickets;
  }

  async findTicketsByUserReports(mesFiltro?: number, anioFiltro?: number) {
    const users = await this.userRepository.find({
      where: {rol:ROLES.SOPORTE},
      relations: ['categories', 'categories.tickets', 'categories.tickets.category', 'categories.tickets.subcategory'],
    });
  
    const usersCounts = users.map(user => {

      const filteredTickets = user.categories
        .flatMap(category => category.tickets)
        .filter(ticket => {
          if ((!ticket.soporteReasignado || ticket.soporteReasignado === '')&&(ticket.soporteAsignado === user.nombre)) {
            if (!mesFiltro && !anioFiltro) {
              return true;
            }
            const fechaCreacion = new Date(ticket.createdAt);
            return fechaCreacion.getMonth() === mesFiltro - 1 && fechaCreacion.getFullYear() === Number(anioFiltro);
          }
          return false;
        }); 

        const ticketsTiempo = filteredTickets.filter(ticket => 
          ticket.estado === ESTADOS.CERRADO && !ticket.soporteReasignado &&
          (ticket.tiempoOcupado - ticket.subcategory.tiempo) <= 0
        );
    
        const ticketsCont = filteredTickets.filter(ticket => 
          ticket.estado === ESTADOS.CERRADO && !ticket.soporteReasignado
        );


      return {
        nombre: user.nombre,
        totalTickets: filteredTickets.length,
        ticketsAbiertos: filteredTickets.filter(ticket => ticket.estado === ESTADOS.ABIERTO).length,
        ticketsCerrados: filteredTickets.filter(ticket => ticket.estado === ESTADOS.CERRADO).length,
        ticketsEnProceso: filteredTickets.filter(ticket => ticket.estado === ESTADOS.EN_PROCESO).length,
        ticketsNS: filteredTickets.filter(ticket => ticket.satisfaccion === SATISFACCION.N_S).length,
        ticketsAS: filteredTickets.filter(ticket => ticket.satisfaccion === SATISFACCION.P_S).length,
        ticketsS: filteredTickets.filter(ticket => ticket.satisfaccion === SATISFACCION.S).length,
        ticketsMS: filteredTickets.filter(ticket => ticket.satisfaccion === SATISFACCION.M_S).length,
        ticketsATiempo: ticketsTiempo.length,
        ticketsAtrasados: ticketsCont.length - ticketsTiempo.length,
        ticketsOportuno: filteredTickets.filter(ticket => ticket.a_oportuna === OPORTUNO.SI).length,
        ticketsNoOportuno: filteredTickets.filter(ticket => ticket.a_oportuna === OPORTUNO.NO).length,
        ticketsSolucionado: filteredTickets.filter(ticket => ticket.s_problema === S_PROBLEMA.SI).length,
        ticketsNoSolucionado: filteredTickets.filter(ticket => ticket.s_problema === S_PROBLEMA.NO).length,
      };
    });

    const totalRow = {
      nombre: 'TOTAL',
      totalTickets: usersCounts.reduce((acc, curr) => acc + curr.totalTickets, 0),
      ticketsAbiertos: usersCounts.reduce((acc, curr) => acc + curr.ticketsAbiertos, 0),
      ticketsEnProceso: usersCounts.reduce((acc, curr) => acc + curr.ticketsEnProceso, 0),
      ticketsCerrados: usersCounts.reduce((acc, curr) => acc + curr.ticketsCerrados, 0),
      ticketsNS: usersCounts.reduce((acc, curr) => acc + curr.ticketsNS, 0),
      ticketsAS: usersCounts.reduce((acc, curr) => acc + curr.ticketsAS, 0),
      ticketsS: usersCounts.reduce((acc, curr) => acc + curr.ticketsS, 0),
      ticketsMS: usersCounts.reduce((acc, curr) => acc + curr.ticketsMS, 0),
      ticketsATiempo: usersCounts.reduce((acc, curr) => acc + curr.ticketsATiempo, 0),
      ticketsAtrasados: usersCounts.reduce((acc, curr) => acc + curr.ticketsAtrasados, 0),
      ticketsOportuno: usersCounts.reduce((acc, curr) => acc + curr.ticketsOportuno, 0),
      ticketsNoOportuno: usersCounts.reduce((acc, curr) => acc + curr.ticketsNoOportuno, 0),
      ticketsSolucionado: usersCounts.reduce((acc, curr) => acc + curr.ticketsSolucionado, 0),
      ticketsNoSolucionado: usersCounts.reduce((acc, curr) => acc + curr.ticketsNoSolucionado, 0),
    };
  
    usersCounts.push(totalRow);
    return usersCounts;
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
    });
    if (!user) {
      throw new NotFoundException('El usuario no fue encontrado');
    }
    return user;
  }
  async findUserByName(nombre: string): Promise<User> {
    const user: User = await this.userRepository.findOne({
      where: {
        nombre,
      },
    });
    if (!user) {
      throw new NotFoundException('El usuario no fue encontrado');
    }
    return user;
  }

  async findUserWithEstSubCat(id_Estab: string, id_Categ: string): Promise<User> {
    const estableishment: Estableishment = await this.estableishmentService.findOneEstableishment(id_Estab);
    const category: Category = await this.categoryService.findOneCategory(id_Categ);
    if (!estableishment || !category) {
      throw new NotFoundException('El establecimiento o la categoria no fue encontrado');
    }
    
    const users = await this.userRepository
      .createQueryBuilder('users')
      .innerJoin('users.estableishments', 'estableishment')
      .innerJoin('users.categories', 'category')
      .where('estableishment.id = :estabId', { estabId: estableishment.id })
      .andWhere('category.id = :categId', { categId: category.id })
      .getMany();

      return users.length > 0 ? users[Math.floor(Math.random() * users.length)] : null;
  }

  async findEstableishmentsByUser(id: string): Promise<Estableishment[]> {
    const user: User = await this.userRepository.findOne({
      where: {
        id,
      },
      relations: ['estableishments', 'estableishments.district'],
    });
    if (!user) {
      throw new NotFoundException('El usuario no fue encontrado');
    }
    return user.estableishments;
  }
  
  async findCategoriesByUser(id: string): Promise<Category[]> {
    const user: User = await this.userRepository.findOne({
      where: {
        id,
      },
      relations: ['categories'],
    });
    if (!user) {
      throw new NotFoundException('El usuario no fue encontrado');
    }
    return user.categories;
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

  async updatePassword(
    userr: User,
    body: UpdateUserPassword,
  ): Promise<UpdateResult> {
    const userFound = await this.findOneUser(userr.id);
    if (!userFound) {
      throw new NotFoundException('Usuario no encontrado');
    }
    if (!bcryptjs.compareSync(body.contrasenia, userr.contrasenia)) {
      throw new BadRequestException('Contraseña actual incorrecta');
    }

    const hashedPassword = bcryptjs.hashSync(body.newContrasenia, 10);

    const user: UpdateResult = await this.userRepository.update(userr.id, {
      contrasenia: hashedPassword,
    });
    if (user.affected === 0) {
      throw new BadRequestException('No se pudo actualizar el usuario');
    }
    return user;
  }

  async resetPassword(
    id: string,
    newpassword: string,
  ): Promise<any> {
    const user = await this.findOneUser(id);
    if (!user) {
      throw new BadRequestException('Usuario no encontrado');
    }
    const hashedPassword = bcryptjs.hashSync(newpassword, 10);
    user.contrasenia = hashedPassword;

   await this.userRepository.save(user);
  }

  //AÑADIR ESTABLECIMIENTOS A USUARIOS
  async asigEstableishToUser(id: string, body: AddEstableishmentDto) {
    
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['estableishments'],
    });
    if (!user) {
      throw new NotFoundException('El usuario especificado no existe');
    }

    if (user.rol === ROLES.ADMINISTRADOR) {
      throw new BadRequestException('Usuario ADMINSTRADOR no puede relacionarse a establecimientos');
    }
    
    const estableishment =
      await this.estableishmentService.findOneEstableishment(
        body.estableishment,
      );

    if (!estableishment) {
      throw new NotFoundException('El establecimiento especificado no existe');
    }

    const establecimientoYaAsociado = user.estableishments.some(
      (est) => est.id === body.estableishment,
    );
    if (establecimientoYaAsociado) {
      throw new BadRequestException(
        'El establecimiento ya está asignado a este usuario',
      );
    }

    user.estableishments.push(estableishment);
    await this.userRepository.save(user);

    return user.estableishments;
  }

  async removeEstableishmentToUser(
    id: string,
    body: AddEstableishmentDto,
  ) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['estableishments'],
    });

    if (!user) {
      throw new NotFoundException('El usuario especificado no existe');
    }

    if (user.rol === ROLES.ADMINISTRADOR) {
      throw new BadRequestException('El usuario ADMINSTRADOR no puede eliminar relaciones a establecimientos, por que no deberia tener');
    }

    const establecimientoIndex = user.estableishments.findIndex(
      (est) => est.id === body.estableishment,
    );

    if (establecimientoIndex === -1) {
      throw new NotFoundException(
        'El establecimiento especificado no está asociado a este usuario',
      );
    }

    user.estableishments.splice(establecimientoIndex, 1);

    await this.userRepository.save(user);
    return user.estableishments;
  }

  //AÑADIR CATEGORIAS A USUARIOS
  async asigCategoryToUser(id: string, body: AddCategoryDto) {
      
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['categories'],
    });
    if (!user) {
      throw new NotFoundException('El usuario especificado no existe');
    }

    if (user.rol === ROLES.ADMINISTRADOR) {
      throw new BadRequestException('Usuario ADMINSTRADOR no puede relacionarse a categorias');
    }
    
    const category =
      await this.categoryService.findOneCategory(
        body.category,
      );

    if (!category) {
      throw new NotFoundException('El establecimiento especificado no existe');
    }

    const categoriaYaAsociado = user.categories.some(
      (cat) => cat.id === body.category,
    );
    if (categoriaYaAsociado) {
      throw new BadRequestException(
        'La Categoria ya está asignado a este usuario',
      );
    }

    user.categories.push(category);
    await this.userRepository.save(user);

    return user.categories;
  }

  async removeCategorytToUser(
    id: string,
    body: AddCategoryDto,
  ) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['categories'],
    });

    if (!user) {
      throw new NotFoundException('El usuario especificado no existe');
    }

    if (user.rol === ROLES.ADMINISTRADOR) {
      throw new BadRequestException('El usuario ADMINSTRADOR no puede eliminar relaciones a Categorias, por que no deberia tener');
    }

    const categoriaIndex = user.categories.findIndex(
      (cat) => cat.id === body.category,
    );

    if (categoriaIndex === -1) {
      throw new NotFoundException(
        'La Categoria especificada no está asociado a este usuario',
      );
    }

    user.categories.splice(categoriaIndex, 1);

    await this.userRepository.save(user);
    return user.categories;
  }



  async removeUser(id: string) {
    const user = await this.findOneUser(id);
    if (!user) {
      throw new BadRequestException('No existe el usuario');
    }
    return await this.userRepository.remove(user);
    
  }
}
