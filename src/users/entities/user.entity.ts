
import { BeforeInsert, BeforeUpdate, Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { N_INTRUCCION, ROLES, R_LABORAL, ETNIA, M_LABORAL, NOMBRAMIENTO, SEXO } from '../../constants/opcions';
import { BaseEntity } from "../../config/base.entity";
import { Estableishment } from "../../estableishments/entities/estableishment.entity";
// import { Exclude } from 'class-transformer';

import { Ticket } from "../../tickets/entities/ticket.entity";

@Entity({name: 'users'})
export class User extends BaseEntity{
    
    @Column({unique: true})
    usuario: string;

    @Column()
    contrasenia: string;

    @Column({ type: 'enum', enum: ROLES, default: ROLES.USUARIO})
    rol: ROLES;

    @Column({ default: true})
    estado: boolean;

    @Column({ type: 'text', nullable: true })
    nombre: string;

    @Column({ type: 'enum', enum: SEXO, nullable: true})
    sexo: SEXO;

    @Column({type: 'enum', enum: N_INTRUCCION, nullable: true})
    nivel_institucional: N_INTRUCCION;

    @Column({nullable: true})
    itinerancia: string;

    @Column({nullable: true})
    profesion: string;

    @Column({ type: 'enum', enum: ETNIA, nullable: true})
    etnia: ETNIA; 

    @Column({ type: 'date', nullable: true })
    fecha_nacimiento: Date;

    @Column({nullable: true})
    telefono: string;

    @Column({nullable: true})
    direccion: string;

    @Column({unique: true, nullable: true})
    correo_institucional: string;

    @Column({unique: true, nullable: true})
    correo_personal: string;

    @Column({type: 'enum', enum: R_LABORAL, nullable: true})
    regimen_laboral: R_LABORAL;

    @Column({ type: 'enum', enum: M_LABORAL, nullable: true })
    modalidad_laboral: M_LABORAL;
    
    @Column({ type: 'enum', enum: NOMBRAMIENTO, nullable: true })
    nombramiento: NOMBRAMIENTO;

    @Column( {nullable: true})
    area_laboral: string;

    @Column({ type: 'date' , nullable: true})
    fecha_ingreso: Date;

    @ManyToOne(()=> Estableishment, (estableishment)=> estableishment.user )
    @JoinColumn({name: 'id_estableishment'})
    estableishment: Estableishment;

    @OneToMany(()=> Ticket, (tickets)=> tickets.user )
    tickets: Ticket[];

    // Relación con los tickets asignados al usuario de soporte
    @OneToMany(() => Ticket, (ticket) => ticket.soporteUser)
    soporteTickets: Ticket[];

    // @BeforeInsert()
    // async upperCampos(): Promise<any>{
    //     console.log('Método checkFileBeforeInsert ejecutado');
    //     this.nombre = this.nombre.toLowerCase();
    // }

    // @BeforeUpdate()
    // async campos(): Promise<any>{
    //     console.log('Método checkFileBeforeInsert ejecutado');
    //     this.nombre = this.nombre.toLowerCase();
    // }
}


