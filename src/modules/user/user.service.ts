import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { AuthDto } from '../auth/dto/auth.dto';
import { hash } from 'argon2';
import { UserDto } from './dto/user.dto';
import { startOfDay, subDays } from 'date-fns';

@Injectable()
export class UserService {
  public constructor(private readonly prismaService: PrismaService) {}

  public async create(dto: AuthDto) {
    const { email, password } = dto;
    const isExistUser = await this.findByEmail(email);
    if (isExistUser) {
      throw new ConflictException('Пользователь с таким email уже существует');
    }

    const user = await this.prismaService.user.create({
      data: {
        email,
        password: await hash(password),
      },
    });

    return user;
  }

  public async update(id: string, dto: UserDto) {
    let data = dto;

    if (dto.password) {
      data = { ...data, password: await hash(dto.password) };
    }

    const user = await this.prismaService.user.update({
      where: {
        id,
      },
      data,
      select: {
        email: true,
        username: true,
      },
    });

    return user;
  }

  public async findById(id: string) {
    return await this.prismaService.user.findUnique({
      where: {
        id,
      },
      include: {
        tasks: true,
      },
    });
  }


  public async findProfile(id: string) {
    const profile = await this.findById(id);

    const totalTasks = profile.tasks.length;
    const completedTasks = await this.prismaService.task.count({
      where: {
        userId: id,
        isCompeted: true,
      },
    });
    const todayStart = startOfDay(new Date());
    const weekStart = startOfDay(subDays(new Date(), 7));

    const todayTasks = await this.prismaService.task.count({
      where: {
        userId: id,
        createdAt: {
          gte: todayStart.toISOString(),
        },
      },
    });

    const weekTasks = await this.prismaService.task.count({
      where: {
        userId: id,
        createdAt: {
          gte: weekStart.toISOString(),
        },
      },
    });

    const { password, ...rest } = profile;

    return {
      user: rest,
      statistics: [
        { label: 'Total', value: totalTasks },
        { label: 'Completed tasks', value: completedTasks },
        { label: 'Today tasks', value: todayTasks },
        { label: 'Week tasks', value: weekTasks },
      ],
    };
  }

  public async findByEmail(email: string) {
    return await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });
  }
}
