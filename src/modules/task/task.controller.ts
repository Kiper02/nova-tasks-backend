import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Put } from '@nestjs/common';
import { TaskService } from './task.service';
import { Auth } from 'src/shared/decorators/auth.decorator';
import { TaskDto } from './dto/task.dto';
import { Authorized } from 'src/shared/decorators/user.decorator';

@Controller('user/task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}
  
  @Post()
  @HttpCode(HttpStatus.OK)
  @Auth()
  public async create(
    @Body() dto: TaskDto,
    @Authorized('id') userId: string 
  ) {
    return await this.taskService.create(userId, dto);
  }


  @Get()
  @Auth()
  public async findAll(
    @Authorized('id') userId: string 
  ) {
    return await this.taskService.findAll(userId);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @Auth()
  public async update(
    @Authorized('id') userId: string,
    @Body() dto: TaskDto,
    @Param('id') taskId: string
  ) {
    return await this.taskService.update(userId, taskId, dto);
  }
}
