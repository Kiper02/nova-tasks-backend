import {  Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AuthDto } from './dto/auth.dto';
import { UserService } from '../user/user.service';
import { verify } from 'argon2';
import { Request, Response } from 'express';
import { isDev } from 'src/shared/utils/is-dev.util';
import { clearCookie, saveCookie } from 'src/shared/utils/cookie.util';

@Injectable()
export class AuthService {
    public constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
        private readonly userService: UserService,
    ) {}


    async login(res: Response, dto: AuthDto) {
        const user = await this.validateUser(dto);
    
        const tokens = this.generateTokens(user.id);
        const { accessToken, refreshToken } = tokens;
        saveCookie(res, this.configService.getOrThrow<string>("REFRESH_TOKEN_NAME"), refreshToken, this.configService);
        
        return {
            user,
            accessToken
        }
    }

    async register(res: Response, dto: AuthDto) {  
        const user = await this.userService.create(dto);

        const tokens = this.generateTokens(user.id);
        const { accessToken, refreshToken } = tokens;
        saveCookie(res, this.configService.getOrThrow<string>("REFRESH_TOKEN_NAME"), refreshToken, this.configService);
        return {
            user,
            accessToken
        }
    }

    async logout(res: Response) {  
        clearCookie(res, this.configService.getOrThrow<string>("REFRESH_TOKEN_NAME"));
        return true
    }

    async refresh(req: Request, res: Response) {
        const token = req.cookies[this.configService.getOrThrow<string>("REFRESH_TOKEN_NAME")];
        if(!token) {
            clearCookie(res, this.configService.getOrThrow<string>("REFRESH_TOKEN_NAME"));
            throw new UnauthorizedException("Отсутствует refresh токен")
        }

        await this.validateToken(token);
        const {id} = this.jwtService.decode(token);
        if(!id) {
            throw new UnauthorizedException("Невалидный токен")
        }
        const user = await this.userService.findById(id);
        if(!user) {
            throw new UnauthorizedException("Пользователь не найден")
        }
        const tokens = this.generateTokens(user.id);
        const { accessToken, refreshToken } = tokens;
        saveCookie(res, this.configService.getOrThrow<string>("REFRESH_TOKEN_NAME"), refreshToken, this.configService);
        return {
            user,
            accessToken
        }
    }


    private generateTokens(userId: string) {
        const data = {id: userId};
        const accessToken = this.jwtService.sign(data, {
            expiresIn: '1h'
        })

        const refreshToken = this.jwtService.sign(data, {
            expiresIn: '7d'
        })

        return {accessToken, refreshToken}
    }

    private async validateUser(dto: AuthDto) {
        const user = await this.userService.findByEmail(dto.email);

        if(!user) {
            throw new NotFoundException("Пользователь не найден");
        }

        const isValid = await verify(user.password, dto.password);

        if(!isValid) {
            throw new UnauthorizedException("Неверный пароль");
        }

        const {password, ...userData} = user;
        return userData;
    }

    private async validateToken(token: string) {
        const isValid = await this.jwtService.verifyAsync(token);
        if(!isValid) {
            throw new UnauthorizedException("Невалидный токен");
        }
        return true;
    }


}
