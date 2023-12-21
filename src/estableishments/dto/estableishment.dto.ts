import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { DistrictDto } from "src/districts/dto/district.dto";

export class EstableishmentDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    codigo: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    nombre: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    institucion: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    nivel_atencion: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    tipologia: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    provincia: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    canton: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    parroquia: string;

    // @ApiProperty()
    // @IsNotEmpty()
    // district: DistrictDto; 
}

export class UpdateEstableishmentDto {
    @ApiProperty()
    @IsOptional()
    @IsString()
    codigo: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    nombre: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    institucion: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    nivel_atencion: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    tipologia: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    provincia: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    canton: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    parroquia: string;

    // @ApiProperty()
    // @IsOptional()
    // district: DistrictDto;

}
