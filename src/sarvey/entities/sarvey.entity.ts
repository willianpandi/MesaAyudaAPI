import { BaseEntity } from "src/config/base.entity";
import { SATISFACCION } from "src/constants/opcions";
import { Column, Entity, OneToOne } from "typeorm";

@Entity({name: 'sarveys'})
export class Sarvey extends BaseEntity {
    @Column()
    codigo: string;

    @Column({ type: 'enum', enum: SATISFACCION })
    satisfaccion: SATISFACCION;

    @Column()
    sugerencias: string;
}
