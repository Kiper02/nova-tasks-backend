import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from 'src/modules/auth/auth.module';
import { UserModule } from 'src/modules/user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { TaskModule } from 'src/modules/task/task.module';
import { TimeBlockModule } from 'src/modules/time-block/time-block.module';
import { PomodoroModule } from 'src/modules/pomodoro/pomodoro.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
    }),

    PrismaModule,
    UserModule,
    AuthModule,
    TaskModule,
    TimeBlockModule,
    PomodoroModule,
  ],
})
export class AppModule {}
