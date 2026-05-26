import { Body, Injectable } from '@nestjs/common';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SkillsService {
  constructor(private prismaService: PrismaService) {}

  async create(createSkillDto: CreateSkillDto): Promise<CreateSkillDto> {
    const data = await this.prismaService.skill.create({
      data: createSkillDto
    })

    return data;
  }

  async findAll() {
    const data = await this.prismaService.skill.findMany();
    return `This action returns all skills`;
  }

  findOne(id: number) {
    return `This action returns a #${id} skill`;
  }

  update(id: number, updateSkillDto: UpdateSkillDto) {
    return `This action updates a #${id} skill`;
  }

  remove(id: number) {
    return `This action removes a #${id} skill`;
  }
}
