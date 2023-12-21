import { BaseEntity } from "src/config/base.entity";
import { Ticket } from "src/tickets/entities/ticket.entity";
import { Column, Entity, OneToMany } from "typeorm";

@Entity({name: 'directives'})
export class Directive extends BaseEntity {
    
    @Column()
    nombre: string;

    @Column()
    descripcion: string;

    @Column()
    rango_tiempo: string;


    // RELACION
    @OneToMany(()=> Ticket, (tickets)=> tickets.directive )
    tickets: Ticket[];
}
