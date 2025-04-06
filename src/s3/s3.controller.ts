import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCookieAuth,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import {
  MemberAuth,
  MemberGuard,
} from 'src/auth/auth.guard';
import {
  S3Service,
} from './s3.service';
import {
  CreatePreSignedUrlDto,
} from './dto/request';
import {
  PresignedUrlDto,
} from './dto/response';

@Controller()
export class S3Controller {

  constructor(
    private readonly s3Service: S3Service,
  ) { }

  @ApiOperation({
    summary: 'CDN 업로드용 주소',
    description: 'CDN에 업로드 하기 위한 사전 서명된 URL을 생성합니다.',
  })
  @ApiBody({
    type: CreatePreSignedUrlDto,
    description: '파일 확장자',
  })
  @ApiOkResponse({
    type: PresignedUrlDto,
    description: '사전 서명된 URL',
  })
  @ApiBearerAuth()
  @ApiCookieAuth()
  @UseGuards(MemberGuard)
  @HttpCode(HttpStatus.OK)
  @Post()
  public async getPresignedUrl(
    @MemberAuth() memberId: number,
    @Body() body: CreatePreSignedUrlDto,
  ) {
    const key = this.s3Service.generateKey(memberId, body.extension);
    const presigned = await this.s3Service.getPresignedUrl(key);
    return PresignedUrlDto.from(presigned.url, presigned.key);
  }
}
