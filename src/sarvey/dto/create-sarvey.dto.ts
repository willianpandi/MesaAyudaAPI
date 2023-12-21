import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { SATISFACCION } from "src/constants/opcions";

export class SarveyDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    codigo: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsEnum(SATISFACCION)
    satisfaccion: SATISFACCION;

    @ApiProperty()
    @IsOptional()
    @IsString()
    sugerencias?: string;
}
export class UpdateSarveyDto {
    @ApiProperty()
    @IsOptional()
    @IsString()
    codigo: string;

    @ApiProperty()
    @IsOptional()
    @IsEnum(SATISFACCION)
    satisfaccion: SATISFACCION;

    @ApiProperty()
    @IsOptional()
    @IsString()
    sugerencias: string;
}


