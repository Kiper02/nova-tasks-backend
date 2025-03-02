import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put } from '@nestjs/common';
import { PomodoroService } from './pomodoro.service';
import { Auth } from 'src/shared/decorators/auth.decorator';
import { Authorized } from 'src/shared/decorators/user.decorator';
import { PomodoroRoundDto } from './dto/pomodoro-round.dto';
import { PomodoroSessionDto } from './dto/pomodoro-session.dto';

@Controller('pomodoro')
export class PomodoroController {
  public constructor(private readonly pomodoroService: PomodoroService) {}


  @Post()
  @HttpCode(HttpStatus.OK)
  @Auth()
  public async create(
    @Authorized('id')  userId: string
  ) {
    return await this.pomodoroService.create(userId);
  }

  @Put('round/:id')
  @HttpCode(HttpStatus.OK)
  @Auth()
  public async updateRound(
    @Param('id') id: string,
    @Body() dto: PomodoroRoundDto
  ) {
    return await this.pomodoroService.updateRound(dto, id);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @Auth()
  public async update(
    @Param('id') id: string,
    @Body() dto: PomodoroSessionDto,
    @Authorized('id')  userId: string
  ) {
    return await this.pomodoroService.update(dto, id, userId);
  }

  @Get('today')
  public async findTodaySession(
    @Authorized('id') userId: string
  ) {
    return await this.pomodoroService.findTodaySession(userId)
  }

  @Delete(':id')
  public async delete(
    @Param('id') id: string,
    @Authorized('id') userId: string
  ) {
    return await this.pomodoroService.deleteSession(id, userId)
  }
}
