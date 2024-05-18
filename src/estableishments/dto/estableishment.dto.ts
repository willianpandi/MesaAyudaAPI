import { ApiProperty, PartialType } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class EstableishmentDto {
    
    @ApiProperty()
    @IsNotEmpty()
    @IsBoolean()
    estado: boolean;
    
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
