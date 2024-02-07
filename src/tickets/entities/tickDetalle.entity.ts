import {Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { Ticket } from "./ticket.entity";
import { BaseEntity } from "../../config/base.entity";


@Entity({name: 'ticketsDetail'})
export class TicketDetalle extends BaseEntity {
    @Column()
    detalle: string;

    @ManyToOne(() => Ticket, (ticket) => ticket.ticketdetalle, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'id_tickets'})
    ticket: Ticket;
}