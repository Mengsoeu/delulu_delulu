import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MinLength, MaxLength, IsOptional } from "class-validator";

export class signUpDto {
    @ApiProperty({ example: 'admin', description: 'The name of the skill' })
    @IsNotEmpty()
    @IsString()
    @MaxLength(30)
    username: string;

    @ApiProperty({ example: '1234', description: 'The name of the skill' })
    @IsNotEmpty()
    @IsString()
    @MaxLength(250)
    password: string;
}