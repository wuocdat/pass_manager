import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateAuditLogDto {
  @ApiProperty({ required: false, example: 'user-uuid' })
  @IsOptional()
  @IsUUID()
  userId?: string;

  @ApiProperty({ example: 'password.create' })
  @IsString()
  action!: string;

  @ApiProperty({ required: false, example: 'password' })
  @IsOptional()
  @IsString()
  targetType?: string;

  @ApiProperty({ required: false, example: 'target-uuid' })
  @IsOptional()
  @IsUUID()
  targetId?: string;
}
