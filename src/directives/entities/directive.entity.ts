import { BaseEntity } from "../../config/base.entity";
import { Ticket } from "../../tickets/entities/ticket.entity";
import { BeforeInsert, BeforeUpdate, Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { User } from '../../users/entities/user.entity';

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

    //Nombre de quien crea el dato
    // @ManyToOne(() => User)
    // @JoinColumn({ name: 'usuarioEmail', referencedColumnName: 'correo_institucional'})
    // user: User;

    // @Column({nullable: true})
    // usuarioEmail: string;

    // @BeforeInsert()
    // upload(){
    //     this.nombre = this.nombre.toLowerCase().trim();
    // }
    // @BeforeUpdate()
    // uploads(){
    //     this.upload();
    // }
}
