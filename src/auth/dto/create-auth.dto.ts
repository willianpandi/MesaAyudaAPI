import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { EstableishmentDto } from "../../estableishments/dto/estableishment.dto";


export class LoginDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    usuario: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    contrasenia: string;

    @ApiProperty()
    @IsOptional()
    @IsBoolean()
    estado: boolean;
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