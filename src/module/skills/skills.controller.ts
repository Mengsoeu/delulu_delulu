import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SkillsService } from './skills.service';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';

@Controller('skills')
export class SkillsController {
  constructor(private readonly skillsService: SkillsService) {}

  @Post()
  create(@Body() createSkillDto: CreateSkillDto) {
    return this.skillsService.create(createSkillDto);
  }

  @Get()
  findAll() {
    const data = this.skillsService.findAll();
    return {
      code: "Get Skill success",
      data: [],
      isPaginate: true,
      meta: {
        total: 1,
        page: 1,
        limit: 10,
      },
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    const data = this.skillsService.findOne(+id);
    return {
      code: "Get SSkill success",
      data: data,
      isPaginate: false
    };
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSkillDto: UpdateSkillDto) {
    return this.skillsService.update(+id, updateSkillDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.skillsService.remove(+id);
  }
}
