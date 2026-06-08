import { ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class SignUpDto {
    @ApiProperty({ example: 'John007', description: 'Username' })
    @IsNotEmpty()
    @IsString()
    @MaxLength(30)
    username: string;

    @ApiProperty({ example: '12345', description: 'User password' })
    @IsNotEmpty()
    @IsString()
    @MaxLength(250)
    password: string;
}