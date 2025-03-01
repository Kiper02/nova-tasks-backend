import { ConfigService } from "@nestjs/config";
import { Response } from "express";
import { isDev } from "./is-dev.util";

export const saveCookie = (res: Response, cookieName: string, data: string, configService: ConfigService) => {
    const expiresAt = new Date();
    expiresAt.setTime(expiresAt.getTime() + configService.getOrThrow<number>("COOKIE_EXPIRES_AT"))
    res.cookie(cookieName, data, {
        httpOnly: !isDev(configService),
        domain: !isDev(configService) ? configService.getOrThrow<string>("API_URL") : undefined,
        secure: !isDev(configService),
        sameSite: isDev(configService) ? 'none' : 'lax',
        expires: expiresAt
    })
    return res;
}

export const clearCookie = (res: Response, cookieName: string) => {
    res.clearCookie(cookieName);
    return res;
}