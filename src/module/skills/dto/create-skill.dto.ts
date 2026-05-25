import { ApiProperty } from "@nestjs/swagger";

export class CreateSkillDto {
    @ApiProperty({ example: 'JavaScript', description: 'The name of the skill' })
    name: string;
}
