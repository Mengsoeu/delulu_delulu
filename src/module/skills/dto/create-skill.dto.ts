import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MinLength, MaxLength, IsOptional } from "class-validator";

export class CreateSkillDto {
    @ApiProperty({ example: 'JavaScript', description: 'The name of the skill' })
    @IsNotEmpty()
    @IsString()
    @MaxLength(250)
    name: string;

    @ApiProperty({ example: 'A programing language', description: 'The name of the skill' })
    @IsOptional()
    @IsString()
    @MaxLength(250)
    description: string | null;
}
