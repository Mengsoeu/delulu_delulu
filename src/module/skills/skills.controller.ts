import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { SkillsService } from './skills.service';
import { ApiBadRequestResponse, ApiBody, ApiNotFoundResponse, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { QuerySkillDto, CreateSkillDto, UpdateSkillDto } from './dto/index.dto';

@Controller('skills')
export class SkillsController {
  constructor(private readonly skillsService: SkillsService) {}

  @Post()
  @ApiResponse({ status: 200, description: 'Created skill successfully' })
  async create(@Body() createSkillDto: CreateSkillDto) {
    const data = await this.skillsService.create(createSkillDto);

    return {
      code: "Post Skill success",
      data
    }
  }

  @Get()
  @ApiQuery({
    name: 'search',
    required: false,
  })
  @ApiQuery({
    name: 'page',
    required: false,
    default: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    default: 5,
  })
  @ApiResponse({ status: 200, description: 'List of skills retrieved successfully' })
  async findAll(@Query() queryDto: QuerySkillDto) {
    const data = await this.skillsService.findAll(queryDto);
    return {
      code: "Get Skill success",
      data: data,
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
  @ApiParam({
    name: 'id',
    description: 'skill Id' 
  })
  @ApiResponse({ status: 200, description: 'Update Skill successfully'})
  update(@Param('id') id: string, @Body() updateSkillDto: UpdateSkillDto) {
    return this.skillsService.update(+id, updateSkillDto);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    description: 'skill Id' 
  })
  @ApiResponse({ status: 200, description: 'Delete Skill successfully'})
  remove(@Param('id') id: string) {
    return this.skillsService.remove(+id);
  }
}
