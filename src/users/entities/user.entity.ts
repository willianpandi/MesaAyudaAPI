
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from "typeorm";
import { N_INTRUCCION, ROLES, R_LABORAL } from 'src/constants/opcions';
import { ETNIA, M_LABORAL, NOMBRAMIENTO, SEXO } from "src/constants/opcions";
import { BaseEntity } from "src/config/base.entity";
import { Estableishment } from "src/estableishments/entities/estableishment.entity";

// import { Profile } from "src/profiles/entities/profile.entity";
import { Ticket } from "src/tickets/entities/ticket.entity";

@Entity({name: 'users'})
export class User extends BaseEntity{
    
    @Column({unique: true})
    usuario: string;

    @Column()
    contrasenia: string;

    @Column({ type: 'enum', enum: ROLES, nullable: true })
    rol: ROLES;

    @Column({ default: true})
    estado: boolean;


    @Column({nullable: true})
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
    telefono: number;

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

    // RELACIONES
    // @OneToOne(()=>  Profile)
    // @JoinColumn({name: 'id_profile'})
    // profile: Profile;

    @ManyToOne(()=> Estableishment, (estableishment)=> estableishment.user )
    @JoinColumn({name: 'id_estableishment'})
    estableishment: Estableishment;

    @OneToMany(()=> Ticket, (tickets)=> tickets.user )
    tickets: Ticket[];

}
