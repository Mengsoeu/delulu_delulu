import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MinLength, MaxLength, IsOptional } from "class-validator";

export class loginDto {
    @ApiProperty({ example: 'admin', description: 'The name of the skill' })
    @IsNotEmpty()
    @IsString()
    username: string;

    @ApiProperty({ example: '1234', description: 'The name of the skill' })
    @IsNotEmpty()
    @IsString()
    password: string;
}