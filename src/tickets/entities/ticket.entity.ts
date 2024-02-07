import { Column, Entity, Generated, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { BaseEntity } from "../../config/base.entity";
import { ESTADOS, SATISFACCION } from "../../constants/opcions";
import { Directive } from "../../directives/entities/directive.entity";
import { User } from "../../users/entities/user.entity";
import { File } from "./file.entity";
import { TicketDetalle } from "./tickDetalle.entity";


@Entity({name: 'tickets'})
export class Ticket extends BaseEntity {
    @Column()
    @Generated('increment')
    codigo: number;

    @Column()
    titulo: string;

    @Column()
    descripcion: string;

    @Column()
    area: string;

    @Column()
    piso: string;

    @Column()
    n_sala: string;

    @Column()
    n_consultorio: string;

    @Column({type: 'enum', enum: ESTADOS, default: ESTADOS.ABIERTO})
    estado: ESTADOS;

    @Column({ type: 'enum', enum: SATISFACCION, nullable: true })
    satisfaccion: SATISFACCION;

    @Column({nullable: true})
    sugerencias: string;

    // RELACION

    @ManyToOne(()=> Directive, (directive)=> directive.tickets)
    @JoinColumn({name: 'id_directive'})
    directive: Directive;
    
    @ManyToOne(()=> User, (user)=> user.tickets, { eager: true })
    @JoinColumn({name: 'id_user'})
    user: User;

    @ManyToOne(() => User, (soportUser) => soportUser.soporteTickets, { eager: true, nullable: true })
    @JoinColumn({ name: 'id_user_soporte' })
    soporteUser: User; // Relación con el usuario de soporte

    @OneToMany(()=> File, (files) => files.ticket, { cascade:true, eager: true, } )
    files?: File[];

    @OneToMany(() => TicketDetalle, (ticketdetalle) => ticketdetalle.ticket, { cascade: true, eager: true })
    ticketdetalle?: TicketDetalle[];

}
