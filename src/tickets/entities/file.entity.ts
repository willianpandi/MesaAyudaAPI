import { Ticket } from './ticket.entity';
import { BaseEntity } from "../../config/base.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";


@Entity({name: 'files'})
export class File extends BaseEntity {
    @Column()
    archivo: string;

    @ManyToOne(() => Ticket, (ticket) => ticket.files, { onDelete: 'CASCADE'})
    @JoinColumn({name: 'id_tickets'})
    ticket: Ticket;
}
