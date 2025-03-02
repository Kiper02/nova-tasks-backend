import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { TimeBlockDto } from './dto/time-block.dto';

@Injectable()
export class TimeBlockService {
  public constructor(private readonly prismaService: PrismaService) {}

  public async create(userId: string, dto: TimeBlockDto) {
    return await this.prismaService.timeBlock.create({
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
    return await this.prismaService.timeBlock.findMany({
      where: {
        userId,
      },
      orderBy: {
        order: 'asc',
      },
    });
  }

  public async update(
    userId: string,
    timeBlockId: string,
    dto: Partial<TimeBlockDto>,
  ) {
    return await this.prismaService.timeBlock.update({
      where: {
        userId,
        id: timeBlockId,
      },
      data: dto,
    });
  }

  public async delete(timeBlockId: string, userId: string) {
    return await this.prismaService.timeBlock.delete({
      where: {
        id: timeBlockId,
        userId,
      },
    });
  }

  public async updateOrder(ids: string[]) {
    return await this.prismaService.$transaction(
      ids.map((id, order) =>
        this.prismaService.timeBlock.update({
          where: { id },
          data: { order },
        }),
      ),
    );
  }
}
