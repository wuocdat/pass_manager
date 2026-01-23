import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsIn,
  IsInt,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';

export class EncryptionMetaDto {
  @ApiProperty({ example: 'aes-256-gcm' })
  @IsString()
  @IsIn(['aes-256-gcm'])
  algorithm!: string;

  @ApiProperty({ example: 'base64' })
  @IsString()
  iv!: string;

  @ApiProperty({ example: 'base64' })
  @IsString()
  tag!: string;

  @ApiProperty({ required: false, example: 1 })
  @IsOptional()
  @IsInt()
  keyVersion?: number;
}

export class CreatePasswordDto {
  @ApiProperty({ required: false, example: 'folder-uuid' })
  @IsOptional()
  @IsUUID()
  folderId?: string;

  @ApiProperty({ example: 'Gmail' })
  @IsString()
  title!: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiProperty({ example: 'encrypted_base64' })
  @IsString()
  passwordEncrypted!: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  url?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({
    example: { algorithm: 'aes-256-gcm', iv: 'base64', tag: 'base64' },
  })
  @ValidateNested()
  @Type(() => EncryptionMetaDto)
  encryptionMeta!: EncryptionMetaDto;

  @ApiProperty({ required: false, default: false })
  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;
}

export class UpdatePasswordDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  folderId?: string | null;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  passwordEncrypted?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  url?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => EncryptionMetaDto)
  encryptionMeta?: EncryptionMetaDto;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;
}
