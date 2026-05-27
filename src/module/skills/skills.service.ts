import { Body, Injectable, NotFoundException } from '@nestjs/common';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { emailInUse } from 'src/common/filter/exception/emai-inUse.exception';

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

  async update(id: number, updateSkillDto: UpdateSkillDto) {
    const data1 = await this.isExist(id);
    if (!data1) {
      throw new emailInUse({
        errorCode: "ERR.INVALID_ID",
        message: "Id is invalid or not found",
      });
    }

    const data = await this.prismaService.skill.update({
      data: updateSkillDto,
      where: { id }
    })

    return data;
  }

  async remove(id: number) { 
    const data = await this.isExist(id);
    if (!data) {
      throw new emailInUse({
        errorCode: "ERR.INVALID_ID",
        message: "Id is invalid or not found",
      });
    }
    return await this.prismaService.skill.delete({
      where: { id }
    })
  }

  async isExist(id: number) {
    const isSkillExist = await this.prismaService.skill.findFirst({
      where: { id }
    })
    return isSkillExist
  }
}
