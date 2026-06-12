import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe, Req } from '@nestjs/common';
import { SkillsService } from './skills.service';
import { ApiBearerAuth, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { QuerySkillDto, CreateSkillDto, UpdateSkillDto } from './dto/index.dto';
import { Roles } from 'src/common/decorator/role.decorator';
import { PERMISSION, ROLE } from 'src/common/enum/role.enum';
import { Permissions } from 'src/common/decorator/permission.decorator';

@ApiBearerAuth()
@Roles(ROLE.ADMIN)
@Controller('skills')
export class SkillsController {
  constructor(private readonly skillsService: SkillsService) {}

  @Post()
  @Permissions(PERMISSION.ADMIN_CREATE)
  @ApiResponse({ status: 200, description: 'Created skill successfully' })
  async create(@Body() createSkillDto: CreateSkillDto) {
    const data = await this.skillsService.create(createSkillDto);

    return {
      code: "Post Skill success",
      data,
    }
  }

  @Get()
  @Permissions(PERMISSION.ADMIN_READ)
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
  async findAll(@Query() queryDto: QuerySkillDto, @Req() req) {
    const data = await this.skillsService.findAll(queryDto);
    return {
      code: "Get Skill success",
      data: data,
    }
  }  

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const data = await this.skillsService.findOne(+id);
    return {
      code: "Get Skill success",
      data: data,
      isPaginate: false
    };
  }

  @Patch(':id')
  @Permissions(PERMISSION.ADMIN_UPDATE)
  @ApiParam({
    name: 'id',
    description: 'skill Id'
  })
  @ApiResponse({ status: 200, description: 'Update Skill successfully'})
  update(@Param('id') id: string, @Body() updateSkillDto: UpdateSkillDto) {
    return this.skillsService.update(+id, updateSkillDto);
  }

  @Delete(':id')
  @Permissions(PERMISSION.ADMIN_DELETE)
  @ApiParam({
    name: 'id',
    description: 'skill Id'
  })
  @ApiResponse({ status: 200, description: 'Delete Skill successfully'})
  remove(@Param('id') id: string) {
    return this.skillsService.remove(+id);
  }
}
