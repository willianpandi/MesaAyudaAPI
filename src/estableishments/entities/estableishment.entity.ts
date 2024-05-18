import { Ticket } from "../../tickets/entities/ticket.entity";
import { BaseEntity } from "../../config/base.entity";
import { District } from "../../districts/entities/district.entity";
import { User } from "../../users/entities/user.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany } from "typeorm";

@Entity({name: 'estableishments'})
export class Estableishment extends BaseEntity {
    
    @Column()
    estado: boolean;

    @Column()
    codigo: string;

    @Column()
    nombre: string;

    // RELACIONES

    @ManyToOne(()=> District, (district)=> district.estableishments)
    @JoinColumn({name: 'id_district'})
    district: District;

    @ManyToMany( () => User, (user) => user.estableishments )
    @JoinTable({
        name: 'users_estableishments',
        joinColumn: {name: 'id_estableishment'},
        inverseJoinColumn: { name: 'id_user'},
    })
    users: User[];

    @OneToMany(() => Ticket, (tickets) => tickets.estableishment)
    tickets: Ticket[];
}
