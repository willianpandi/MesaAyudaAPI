import { BaseEntity } from "../../config/base.entity";
import { Ticket } from "../../tickets/entities/ticket.entity";
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany } from "typeorm";
import { User } from '../../users/entities/user.entity';
import { SubCategory } from "../../sub-category/entities/sub-category.entity";

@Entity({name: 'categories'})
export class Category extends BaseEntity {

    @Column()
    estado: boolean;
    
    @Column()
    nombre: string;

    @Column()
    descripcion: string;


    // RELACIONES
    @OneToMany(()=> Ticket, (tickets)=> tickets.category )
    tickets: Ticket[];

    @OneToMany(()=> SubCategory, (subcategories)=> subcategories.category)
    subcategories: SubCategory[];

    @ManyToMany(() => User, (user) => user.categories )
    @JoinTable({
        name: 'users_categories',
        joinColumn: {name: 'id_categories'},
        inverseJoinColumn: { name: 'id_user'},
    })
    users: User[];
}
