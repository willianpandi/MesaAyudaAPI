import { Ticket } from './ticket.entity';
import { BaseEntity } from "../../config/base.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";


@Entity({name: 'files'})
export class File extends BaseEntity {
    @Column()
    archivo: string;
    @OneToOne(() => Ticket, (ticket) => ticket.file)
    ticket: Ticket;
}
