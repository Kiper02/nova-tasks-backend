import { IsEmail, IsOptional, IsString, MinLength } from "class-validator";
import { PomodoroSettingsDto } from "./pomodoro-settings.dto";

export class UserDto extends PomodoroSettingsDto{
  @IsOptional()
  @IsString()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  username: string;

  @IsOptional()
  @IsString()
  @MinLength(8, {
    message: 'Пароль должен быть не менее 8 символов',
  })
  password: string;
}
