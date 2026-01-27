import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsObject, IsOptional, IsString, MinLength, ValidateNested } from 'class-validator';

export class UserKeyPayloadDto {
  @ApiProperty({ example: 'wrapped_key_base64' })
  @IsString()
  wrappedMasterKey!: string;

  @ApiProperty({ example: 'salt_base64' })
  @IsString()
  kdfSalt!: string;

  @ApiProperty({ example: { algorithm: 'argon2id', memory: 65536 } })
  @IsObject()
  kdfParams!: Record<string, unknown>;

  @ApiProperty({ required: false, default: 1 })
  @IsOptional()
  keyVersion?: number;
}

export class ChangePasswordDto {
  @ApiProperty({ example: 'plain_password' })
  @IsString()
  @MinLength(8)
  password!: string;

  @ApiProperty()
  @ValidateNested()
  @Type(() => UserKeyPayloadDto)
  userKey!: UserKeyPayloadDto;
}
