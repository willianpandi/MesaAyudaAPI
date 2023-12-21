import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsEmail, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { ROLES, ETNIA, M_LABORAL, NOMBRAMIENTO, SEXO, N_INTRUCCION, R_LABORAL } from "src/constants/opcions";
import { EstableishmentDto } from "src/estableishments/dto/estableishment.dto";


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
    @IsEnum(ROLES)
    rol: ROLES;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    nombre: string;

    @ApiProperty()
    @IsNotEmpty()
    estableishment: EstableishmentDto; 
}

export class ProfileDto {
// PERFILES
    // @ApiProperty()
    // // @IsNotEmpty()
    // @IsString()
    // cedula: string;

    // @ApiProperty()
    // // @IsNotEmpty()
    // @IsOptional()
    // @IsString()
    // nombre: string;

    // @ApiProperty()
    // // @IsNotEmpty()
    // @IsOptional()
    // @IsEnum(SEXO)
    // sexo: SEXO;

    // @ApiProperty()
    // // @IsOptional()
    // @IsNotEmpty()
    // @IsString()
    // nivel_institucional: string;

    // @ApiProperty()
    // // @IsNotEmpty()
    // @IsOptional()
    // @IsString()
    // itinerancia: string;

    // @ApiProperty()
    // @IsNotEmpty()
    // @IsString()
    // profesion: string;

    // @ApiProperty()
    // @IsNotEmpty()
    // @IsEnum(ETNIA)
    // etnia: ETNIA; 

    // @ApiProperty()
    // @IsNotEmpty()
    // @IsDate()
    // fecha_nacimiento: Date;

    // @ApiProperty()
    // @IsNotEmpty()
    // @IsNumber()
    // telefono: string;

    // @ApiProperty()
    // @IsNotEmpty()
    // @IsString()
    // direccion: string;

    // @ApiProperty()
    // @IsNotEmpty()
    // @IsEmail()
    // correo_institucional: string;

    // @ApiProperty()
    // @IsNotEmpty()
    // @IsEmail()
    // correo_personal: string;

    // @ApiProperty()
    // @IsNotEmpty()
    // @IsString()
    // regimen_laboral: string;

    // @ApiProperty()
    // @IsNotEmpty()
    // @IsEnum(M_LABORAL)
    // modalidad_laboral: M_LABORAL;
    
    // @ApiProperty()
    // @IsNotEmpty()
    // @IsEnum(NOMBRAMIENTO)
    // nombramiento: NOMBRAMIENTO;

    // @ApiProperty()
    // @IsNotEmpty()
    // @IsString()
    // area_laboral: string;

    // @ApiProperty()
    // @IsNotEmpty()
    // @IsDate()
    // fecha_ingreso: Date;

}

export class RegisterUserDto {
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
    @IsString()
    nombre: string;

    @ApiProperty()
    @IsNotEmpty()
    estableishment: EstableishmentDto; 

}


export class LoginDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    usuario: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    contrasenia: string;
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
    @IsNumber()
    telefono: number;

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

 }
