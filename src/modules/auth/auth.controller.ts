import { Body, Controller, HttpCode, HttpStatus, Post, Request, Response, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { Request as RequestType, Response as ResponseType } from 'express';

@Controller('auth')
export class AuthController {
  public constructor(private readonly authService: AuthService) {}

  // {passthrough: true}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  public async login(
    @Body() dto: AuthDto,
    @Response({passthrough: true}) res: ResponseType
  ) {
    return await this.authService.login(res, dto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('register')
  public async register(
    @Body() dto: AuthDto,
    @Response({passthrough: true}) res: ResponseType
  ) {
    return await this.authService.register(res, dto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('logout')
  public async logout(
    @Response({passthrough: true}) res: ResponseType
  ) {
    return await this.authService.logout(res);
  }

  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  public async refresh(
    @Request() req: RequestType,
    @Response({passthrough: true}) res: ResponseType
  ) {
    return await this.authService.refresh(req, res);
  }
}
