import { BaseEntity } from "../../config/base.entity";
import { PROVINCIAS } from "../../constants/opcions";
import { Estableishment } from "../../estableishments/entities/estableishment.entity";
import { Column, Entity, OneToMany } from "typeorm";

@Entity({name: 'districts'})
export class District extends BaseEntity {
    @Column()
    codigo: string;
    
    @Column()
    nombre: string;
    
    @Column({ type: 'enum', enum: PROVINCIAS })
    provincia: PROVINCIAS;

    // RELACIONES
    @OneToMany(()=> Estableishment, (estableishments)=> estableishments.district)
    estableishments: Estableishment[];
}
