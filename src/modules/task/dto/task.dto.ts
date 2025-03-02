import { Priority } from "@prisma/client";
import { Transform } from "class-transformer";
import { IsBoolean, IsEnum, IsOptional, IsString } from "class-validator";

export class TaskDto {
    @IsOptional()
    @IsString()
    name: string;

    @IsOptional()
    @IsBoolean()
    isCompleted?: boolean

    @IsOptional()
    @IsString()
    createdAt?: string;

    @IsOptional()
    @IsEnum(Priority)
    @Transform((value) => ('' + value).toUpperCase())
    prioeity?: Priority;
}