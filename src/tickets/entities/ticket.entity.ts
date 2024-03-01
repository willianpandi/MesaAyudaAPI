import { Column, Entity, Generated, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { BaseEntity } from "../../config/base.entity";
import { ESTADOS, OPORTUNO, SATISFACCION, S_PROBLEMA } from "../../constants/opcions";
import { Category } from "../../categories/entities/category.entity";
import { File } from "./file.entity";
import { SubCategory } from "src/sub-category/entities/sub-category.entity";
import { Estableishment } from "src/estableishments/entities/estableishment.entity";



@Entity({name: 'tickets'})
export class Ticket extends BaseEntity {
    @Column()
    @Generated('increment')
    codigo: number;

    @Column()
    cedula: string;

    @Column()
    nombre: string;

    @Column()
    correo_electronico: string;

    @Column()
    telefono: string;

    @Column()
    requerimiento: string;

    @Column()
    descripcion: string;

    @Column()
    area: string;

    @Column({ nullable: true })
    piso: string;

    @Column({ nullable: true })
    n_sala: string;

    @Column({ nullable: true })
    n_consultorio: string;

    @Column({type: 'enum', enum: ESTADOS, default: ESTADOS.ABIERTO})
    estado: ESTADOS;

    @Column({ type: 'enum', enum: SATISFACCION, nullable: true })
    satisfaccion: SATISFACCION;
    
    @Column({ type: 'enum', enum: OPORTUNO, nullable: true })
    a_oportuna: OPORTUNO;

    @Column({ type: 'enum', enum: S_PROBLEMA, nullable: true })
    s_problema: S_PROBLEMA;

    @Column({nullable: true})
    sugerencias: string;

    @Column({nullable: true})
    tiempoOcupado: number;
    
    @Column({nullable: true})
    tiempoReasignado: number;

    @Column({ nullable: true })
    soporteReasignado: string;
    
    @Column()
    soporteAsignado: string;
    
    @Column({ type: 'timestamp', nullable: true })
    reasignadoAt: Date;
    
    @Column({ type: 'timestamp', nullable: true })
    cierreAt: Date;

    @Column({ nullable: true  })
    soportePresente: string;
    
    @Column({ nullable: true  })
    soporteComentario: string;


    // RELACION

    @ManyToOne(() => Estableishment, (estableishment) => estableishment.tickets)
    @JoinColumn({ name: 'id_estableishment',  })
    estableishment: Estableishment;
    
    @ManyToOne(() => SubCategory, (subcategory) => subcategory.tickets)
    @JoinColumn({ name: 'id_subcategory',  })
    subcategory: SubCategory;

    @ManyToOne(()=> Category, (category)=> category.tickets)
    @JoinColumn({name: 'id_category'})
    category: Category;

    @OneToMany(()=> File, (files) => files.ticket, { cascade:true, eager: true, } )
    files?: File[];

}
