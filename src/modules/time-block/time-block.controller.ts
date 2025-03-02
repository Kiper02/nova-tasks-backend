import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { TimeBlockService } from './time-block.service';
import { Authorized } from 'src/shared/decorators/user.decorator';
import { Auth } from 'src/shared/decorators/auth.decorator';
import { UpdateTimeBlockDto } from './dto/update-time-block.dto';
import { TimeBlockDto } from './dto/time-block.dto';

@Controller('user/time-block')
export class TimeBlockController {
  public constructor(private readonly timeBlockService: TimeBlockService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @Auth()
  public async create(
    @Body() dto: TimeBlockDto,
    @Authorized('id') userId: string,
  ) {
    return await this.timeBlockService.create(userId, dto);
  }

  @Get()
  @Auth()
  public async findAll(@Authorized('id') userId: string) {
    return await this.timeBlockService.findAll(userId);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @Auth()
  public async update(
    @Authorized('id') userId: string,
    @Body() dto: TimeBlockDto,
    @Param('id') timeBlockId: string,
  ) {
    return await this.timeBlockService.update(userId, timeBlockId, dto);
  }

  @Put('update-order')
  @HttpCode(HttpStatus.OK)
  @Auth()
  public async updateOrder(@Body() dto: UpdateTimeBlockDto) {
    return await this.timeBlockService.updateOrder(dto.ids);
  }
}
