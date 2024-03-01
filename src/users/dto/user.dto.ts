import { ApiProperty, PartialType } from "@nestjs/swagger";
import { IsBoolean, IsDate, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { ROLES } from "../../constants/opcions";


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
    @IsBoolean()
    estado: boolean;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    nombre: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    puesto: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsDate()
    f_ingreso: Date;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    g_Ocupacional: string;
    
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    m_contrato: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    celular: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    telefono: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    correo_institucional: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    correo_personal: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    c_Administrativo: string;
    
    @ApiProperty()
    @IsOptional()
    @IsString()
    funciones_A: string;
    
    @ApiProperty()
    @IsOptional()
    @IsString()
    observaciones: string;

}

export class UpdateUserDto extends PartialType(UserDto) {}


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

 export class AddEstableishmentDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    estableishment: string;
 }
 
 export class AddCategoryDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    category: string;
 }
