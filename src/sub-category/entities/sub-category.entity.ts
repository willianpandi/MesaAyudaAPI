import { Ticket } from "../../tickets/entities/ticket.entity";
import { Category } from "../../categories/entities/category.entity";
import { BaseEntity } from "../../config/base.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";

@Entity({name: 'subcategories'})
export class SubCategory extends BaseEntity{

    @Column()
    estado: boolean;

    @Column()
    nombre: string;

    @Column()
    tiempo: number;  

    // RELACION

    @OneToMany(() => Ticket, (ticket) => ticket.subcategory)
    tickets: Ticket[];

    @ManyToOne(()=> Category, (category)=> category.subcategories)
    @JoinColumn({name: 'id_category'})
    category: Category;
}
