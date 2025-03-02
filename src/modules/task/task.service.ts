import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { TaskDto } from './dto/task.dto';

@Injectable()
export class TaskService {
  public constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  public async create(userId: string, dto: TaskDto) {
    return await this.prismaService.task.create({
      data: {
        ...dto,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }

  public async findAll(userId: string) {
    return await this.prismaService.task.findMany({
      where: {
        userId,
      },
    });
  }

  public async update(userId: string, taskId: string, dto: Partial<TaskDto>) {
    return await this.prismaService.task.update({
      where: {
        id: taskId,
        userId,
      },
      data: dto,
    });
  }

  public async delete(taskId: string) {
    return await this.prismaService.task.delete({
      where: {
        id: taskId,
      },
    });
  }
}
