import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsDate, IsEmail, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { ROLES, ETNIA, M_LABORAL, NOMBRAMIENTO, SEXO, N_INTRUCCION, R_LABORAL } from "../../constants/opcions";
import { Estableishment } from "../../estableishments/entities/estableishment.entity";


export class UserDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    usuario: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    contrasenia: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsBoolean()
    estado: boolean;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    nombre: string;

    @ApiProperty()
    @IsNotEmpty()
    estableishment: Estableishment;
}






export class UpdateUserDto {
    @ApiProperty()
    @IsOptional()
    @IsString()
    usuario: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    contrasenia: string;

    @ApiProperty()
    @IsOptional()
    @IsEnum(ROLES)
    rol: ROLES;
    
    
    @ApiProperty()
    @IsOptional()
    @IsBoolean()
    estado: boolean;

    @ApiProperty()
    @IsOptional()
    @IsString()
    nombre: string;

    @ApiProperty()
    @IsOptional()
    @IsEnum(SEXO)
    sexo: SEXO;

    @ApiProperty()
    @IsOptional()
    @IsEnum(N_INTRUCCION)
    nivel_institucional: N_INTRUCCION;

    @ApiProperty()
    @IsOptional()
    @IsString()
    itinerancia: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    profesion: string;

    @ApiProperty()
    @IsOptional()
    @IsEnum(ETNIA)
    etnia: ETNIA; 

    @ApiProperty()
    @IsOptional()
    @IsDate()
    fecha_nacimiento: Date;

    @ApiProperty()
    @IsOptional()
    @IsString()
    telefono: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    direccion: string;

    @ApiProperty()
    @IsOptional()
    @IsEmail()
    correo_institucional: string;

    @ApiProperty()
    @IsOptional()
    @IsEmail()
    correo_personal: string;

    @ApiProperty()
    @IsOptional()
    @IsEnum(R_LABORAL)
    regimen_laboral: R_LABORAL;

    @ApiProperty()
    @IsOptional()
    @IsEnum(M_LABORAL)
    modalidad_laboral: M_LABORAL;
    
    @ApiProperty()
    @IsOptional()
    @IsEnum(NOMBRAMIENTO)
    nombramiento: NOMBRAMIENTO;

    @ApiProperty()
    @IsOptional()
    @IsString()
    area_laboral: string;

    @ApiProperty()
    @IsOptional()
    @IsDate()
    fecha_ingreso: Date;

    @ApiProperty()
    @IsOptional()
    @IsNotEmpty()
    estableishment: Estableishment;
 }


 export class UpdateUserPassword {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    contrasenia: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    newContrasenia: string;
 }