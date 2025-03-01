import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { Auth } from 'src/shared/decorators/auth.decorator';
import { Authorized } from 'src/shared/decorators/user.decorator';
import { UserDto } from './dto/user.dto';

@Controller('user/profile')
export class UserController {
  public constructor(private readonly userService: UserService) {}

  @Get()
  @Auth()
  public async profile(
    @Authorized('id') id: string
  ) {
    return await this.userService.findProfile(id);
  }

  @Put()
  @Auth()
  public async updateProfile(
    @Authorized('id') id: string,
    @Body() dto: UserDto
  ) {
    return await this.userService.update(id, dto);
  }
}
