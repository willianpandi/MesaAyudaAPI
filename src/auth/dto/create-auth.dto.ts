import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";


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
