import { ApiProperty } from '@nestjs/swagger';

export class CreateAuditLogDto {
  @ApiProperty({ required: false, example: 'user-uuid' })
  userId?: string;

  @ApiProperty({ example: 'password.create' })
  action!: string;

  @ApiProperty({ required: false, example: 'password' })
  targetType?: string;

  @ApiProperty({ required: false, example: 'target-uuid' })
  targetId?: string;
}
