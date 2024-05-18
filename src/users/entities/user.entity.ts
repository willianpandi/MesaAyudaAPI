import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
} from 'typeorm';
import {
  ROLES,
} from '../../constants/opcions';
import { BaseEntity } from '../../config/base.entity';
import { Estableishment } from '../../estableishments/entities/estableishment.entity';
import { Category } from '../../categories/entities/category.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'users' })
export class User extends BaseEntity {

  @ApiProperty({
    example: 'true',
    description: 'Estado de la cuenta',
  })
  @Column()
  estado: boolean;
  
  @ApiProperty({
    example: '1808888888',
    description: 'Usuario / # de cedula',
    uniqueItems: true,
  })
  @Column({ unique: true })
  usuario: string;

  @ApiProperty({
    example: '123456',
    description: 'Contraseña de usuario',
  })
  @Column()
  contrasenia: string;

  @ApiProperty({
    example: 'SOPORTE',
    description: 'Rol de usuario',
  })
  @Column({ type: 'enum', enum: ROLES })
  rol: ROLES;

  @ApiProperty({
    example: 'Willian Pandi',
    description: 'Nombre de usuario',
  })
  @Column({ type: 'text' })
  nombre: string;

  @ApiProperty({
    example: 'Analista de Soporte Tecnico',
    description: 'Denominacion del puesto',
  })
  @Column({ type: 'text',})
  puesto: string;

  @ApiProperty({
    example: 'SP1',
    description: 'Grupo Ocupacional del Usuario',
  })
  @Column({ type: 'text'})
  g_Ocupacional: string;
  
  @ApiProperty({
    example: 'DEFINITIVO',
    description: 'Modalidad de contrato del Usuario',
  })
  @Column({ type: 'text'})
  m_contrato: string;
  
  @ApiProperty({
    example: '15/08/2023',
    description: 'Fecha de Ingreso del Usuario',
  })
  @Column({type: 'date'})
  f_ingreso: Date;

  @ApiProperty({
    example: '098888888',
    description: '# telefono del usuario',
  })
  @Column()
  celular: string;

  @ApiProperty({
    example: '098888888',
    description: '# telefono del usuario',
  })
  @Column({ nullable:true })
  telefono: string;

  @ApiProperty({
    example: 'ejemplo@coordinacion.com',
    description: 'Correo electrónico institucional del usuario',
    uniqueItems: true,
  })
  @Column({ unique: true })
  correo_institucional: string;
  
  @ApiProperty({
    example: 'ejemplo@gmail.com',
    description: 'Correo electrónico personal del usuario',
    uniqueItems: true,
  })
  @Column({ unique: true })
  correo_personal: string;

  @ApiProperty({
    example: 'Administrativo',
    description: 'Cambio Administrativo',
  })
  @Column({ nullable: true })
  c_Administrativo: string;
  
  @ApiProperty({
    example: 'Soporte Tecnico',
    description: 'Funciones Adicionales del Usuario',
  })
  @Column({ nullable: true })
  funciones_A: string;
  
  @ApiProperty({
    example: 'Soporte Tecnico',
    description: 'Funciones Adicionales del Usuario',
  })
  @Column({ nullable: true })
  observaciones: string;

  @ApiProperty({
    example: '["Datos de Establecimiento"]',
    description: 'Establecimientos a los que pertenece el usuario',
  })
  @ManyToMany( () => Estableishment, (estableishment) => estableishment.users)
  estableishments: Estableishment[];
  
  @ApiProperty({
    example: '["Datos de Temas de Ayuda"]',
    description: 'Establecimientos a los que pertenece el usuario',
  })
  @ManyToMany(() => Category, (categories) => categories.users)
  categories: Category[];

}
