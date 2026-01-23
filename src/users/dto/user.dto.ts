import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'user@example.com' })
  email!: string;

  @ApiProperty({ example: 'hashed_password' })
  passwordHash!: string;

  @ApiProperty({ required: false, example: 'Jane Doe' })
  fullName?: string;

  @ApiProperty({ required: false, default: true })
  isActive?: boolean;
}

export class UpdateUserDto {
  @ApiProperty({ required: false })
  email?: string;

  @ApiProperty({ required: false })
  passwordHash?: string;

  @ApiProperty({ required: false })
  fullName?: string;

  @ApiProperty({ required: false })
  isActive?: boolean;
}
