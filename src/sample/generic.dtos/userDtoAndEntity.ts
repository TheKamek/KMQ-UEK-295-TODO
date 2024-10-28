import { ApiProperty } from '@nestjs/swagger';

export class UserInfoDto {
  @ApiProperty({
    description: 'The UserId',
    minimum: 1,
    default: 1,
    example: 1,
  })
  userId: number;
  @ApiProperty({
    description: 'The username',
    default: 'user',
    example: 'user',
  })
  username: string;
}
// this class will get back from the api. without any password
export class UserReturnDto extends UserInfoDto {
  @ApiProperty({
    description: 'The array with roles',
    default: '[user]',
    example: '[user]',
    isArray: true,
  })
  roles: string[];
}
// this class is used internal, would be the entity
export class UserEntity extends UserReturnDto {
  @ApiProperty({
    description: 'The password of the user',
    default: '****',
    example: '****',
  })
  password: string;
}
