import { BaseEntity } from "src/config/base.entity";
import { ESTADOS } from "src/constants/opcions";
import { Directive } from "src/directives/entities/directive.entity";
import { Sarvey } from "src/sarvey/entities/sarvey.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";

@Entity({name: 'tickets'})
export class Ticket extends BaseEntity {
    @Column()
    descripcion: string;

    @Column({type: 'bytea', nullable: true})
    archivo: Buffer;

    @Column()
    area: string;

    @Column()
    piso: string;

    @Column()
    n_sala: string;

    @Column()
    n_consultorio: string;

    @Column({type: 'enum', enum: ESTADOS})
    estado: ESTADOS;

    // RELACION

    @ManyToOne(()=> Directive, (directiv)=> directiv.tickets)
    @JoinColumn({name: 'id_directive'})
    directive: Directive;
    
    @ManyToOne(()=> User, (user)=> user.tickets)
    @JoinColumn({name: 'id_user'})
    user: User[];

    @OneToOne(()=> Sarvey)
    @JoinColumn({name: 'id_sarvey'})
    sarvey: Sarvey;

}
