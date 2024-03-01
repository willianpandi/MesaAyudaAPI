import { ApiProperty, PartialType } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

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
    district: string; 
}

export class UpdateEstableishmentDto extends PartialType(EstableishmentDto) {}
