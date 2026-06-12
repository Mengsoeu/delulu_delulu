import { Body, Injectable, NotFoundException } from '@nestjs/common';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { emailInUse } from 'src/common/filter/exception/emai-inUse.exception';
import { promises } from 'node:dns';
import { QuerySkillDto } from './dto/get-all-skill.dto';

@Injectable()
export class SkillsService {
  constructor(private prismaService: PrismaService) {}

  async create(createSkillDto: CreateSkillDto): Promise<CreateSkillDto> {
    const data = await this.prismaService.skill.create({
      data: createSkillDto
    })

    return data;
  }

  async findAll(queryDto: QuerySkillDto) {
    // query params
    const search = queryDto.search;
    const page = Number(queryDto.page);
    const limit = Number(queryDto.limit);

    // pagination
    const skip = (page - 1) * limit;

    // total
    const total = await this.prismaService.skill.count({
      where: {
        OR: [
          {
            name: {
              contains: search,
            },
          },
          {
            description: {
              contains: search,
            },
          },
        ],
        deleteAt: null
      },
    });

    const data = await this.prismaService.skill.findMany({
      where: {
        OR: [
          {
            name: {
              contains: search,
            },
          },
          {
            description: {
              contains: search,
            },
          },
        ],
        deleteAt: null
      },
      skip,
      take: limit,
      orderBy: {
        id: 'desc',
      },
    });
    return {
      rows: data,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    }
  }

  async findOne(id: number) {
    const data = await this.prismaService.skill.findFirst({
      where: { id }
    });
    return data;
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
    // await this.prismaService.skill.delete
    return await this.prismaService.skill.update({
      where: { id },
      data: {
        deleteAt: new Date().toISOString(),
      }
    })
  }

  async isExist(id: number) {
    const isSkillExist = await this.prismaService.skill.findFirst({
      where: { id }
    })
    return isSkillExist
  }
}
