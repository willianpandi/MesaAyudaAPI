import { BaseEntity } from "src/config/base.entity";
import { District } from "src/districts/entities/district.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";

@Entity({name: 'estableishments'})
export class Estableishment extends BaseEntity {
    @Column()
    codigo: string;

    @Column()
    nombre: string;

    @Column()
    institucion: string;

    @Column()
    nivel_atencion: string;

    @Column()
    tipologia: string;

    @Column()
    provincia: string;

    @Column()
    canton: string;

    @Column()
    parroquia: string;

    // RELACIONES
    @OneToMany(()=> User, (user)=> user.estableishment )
    user: User[];
    // @OneToMany(()=> Profile, (profile)=> profile.estableishment )
    // profiles: Profile[];

    @ManyToOne(()=> District, (district)=> district.estableishments)
    @JoinColumn({name: 'id_district'})
    district: District;
}
