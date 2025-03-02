import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { UserService } from '../user/user.service';
import { PomodoroSessionDto } from './dto/pomodoro-session.dto';
import { PomodoroRoundDto } from './dto/pomodoro-round.dto';

@Injectable()
export class PomodoroService {
  public constructor(
    private readonly prismaService: PrismaService,
    private readonly userService: UserService,
  ) {}

  public async create(userId: string) {
    const todaySession = await this.findTodaySession(userId);
    if (todaySession) return todaySession;
    const user = await this.userService.findById(userId);

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    return await this.prismaService.pomodoroSession.create({
      data: {
        rounds: {
          createMany: {
            data: Array.from({ length: user.intervalsCount }, () => ({
              totalSeconds: 0,
            })),
          },
        },
        user: {
          connect: {
            id: userId,
          },
        },
      },
      include: {
        rounds: true,
      },
    });
  }

  public async update(
    dto: Partial<PomodoroSessionDto>,
    pomodoroId: string,
    userId: string,
  ) {
    return await this.prismaService.pomodoroSession.update({
      where: {
        userId,
        id: pomodoroId,
      },
      data: {
        isCompeted: dto.isCompleted,
      },
    });
  }

  public async updateRound(dto: Partial<PomodoroRoundDto>, roundId: string) {
    return await this.prismaService.pomodoroRounds.update({
      where: {
        id: roundId,
      },
      data: dto,
    });
  }

  public async deleteSession(sessionId: string, userId: string) {
    return await this.prismaService.pomodoroSession.delete({
      where: {
        id: sessionId,
        userId,
      },
    });
  }

  public async findTodaySession(userId: string) {
    const today = new Date().toISOString().split('T')[0];

    return await this.prismaService.pomodoroSession.findFirst({
      where: {
        createdAt: {
          gte: new Date(today),
        },
        userId,
      },
      include: {
        rounds: {
          orderBy: {
            id: 'asc',
          },
        },
      },
    });
  }
}
