import {
  ApiProperty,
} from '@nestjs/swagger';

export class FollowingDto {

  @ApiProperty({
    description: '스트리머 팔로우 여부',
    example: true,
    required: true,
    type: Boolean,
    nullable: false,
  })
  isFollowing: boolean;

  static from(isFollowing: boolean) {
    const dto = new FollowingDto();
    dto.isFollowing = isFollowing;
    return dto;
  }
}
