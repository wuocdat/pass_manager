import { ApiProperty } from '@nestjs/swagger';

export class CreateFolderDto {
  @ApiProperty({ example: 'owner-uuid' })
  ownerId!: string;

  @ApiProperty({ required: false, example: 'parent-folder-uuid' })
  parentId?: string;

  @ApiProperty({ example: 'Personal' })
  name!: string;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty({ required: false, default: false })
  isPublic?: boolean;
}

export class UpdateFolderDto {
  @ApiProperty({ required: false })
  parentId?: string | null;

  @ApiProperty({ required: false })
  name?: string;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty({ required: false })
  isPublic?: boolean;
}
