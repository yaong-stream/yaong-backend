import {
  All,
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Patch,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCookieAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import {
  MemberGuard,
  MemberAuth,
} from 'src/auth/auth.guard';
import {
  MemberService,
} from 'src/member/member.service';
import {
  StreamService,
} from './stream.service';
import {
  UpdateStreamInfo,
} from './dto/request';
import {
  StreamDto,
} from './dto/response';
import type {
  Request,
} from 'express';

@ApiTags('Stream')
@Controller()
export class StreamController {

  private readonly logger = new Logger(StreamController.name);

  constructor(
    private readonly streamService: StreamService,
    private readonly memberService: MemberService,
  ) { }

  @ApiOperation({
    summary: '스트리머 모드 활성화',
    description: '스트리머 모드를 활성화 합니다.',
  })
  @ApiOkResponse({
    description: '스트리머 모드 활성화 성공',
    schema: {
      type: 'object',
      properties: {
        success: {
          type: 'boolean',
        },
      },
      example: {
        success: true,
      },
    },
  })
  @ApiBearerAuth()
  @ApiCookieAuth()
  @UseGuards(MemberGuard)
  @HttpCode(HttpStatus.OK)
  @Post('enable')
  public async enableStream(
    @MemberAuth() memberId: number,
  ) {
    try {
      const member = await this.memberService.getMemberById(memberId);
      if (member == null) {
        throw new UnauthorizedException('Member Not Found');
      }
      const stream = await this.streamService.activateStream(member.id, member.nickname);
      return {
        success: stream != null,
      };
    } catch (e) {
      this.logger.error('fail to enable streamer mode.');
      this.logger.error(e);
      return {
        success: false,
      };
    }
  }

  public getStreams() {

  }

  @ApiOperation({
    summary: '방송 설명 수정',
    description: '방송 제목 및 설명을 수정합니다.'
  })
  @ApiBody({
    type: UpdateStreamInfo,
    description: '방송 설명 정보',
    required: true,
  })
  @ApiOkResponse({
    description: '방송 설명 수정 성공',
    type: StreamDto,
  })
  @ApiBearerAuth()
  @ApiCookieAuth()
  @UseGuards(MemberGuard)
  @HttpCode(HttpStatus.OK)
  @Patch()
  public async updateStreamInfo(
    @MemberAuth() memberId: number,
    @Body() body: UpdateStreamInfo,
  ) {
    let stream = await this.streamService.getStreamByMemberId(memberId);
    if (stream == null) {
      throw new BadRequestException('Streamer mode not activated.');
    }
    const result = await this.streamService.updateStream(stream.id, body.name, body.description);
    if (!result.affected) {
      throw new BadRequestException('Fail to update stream.');
    }
    stream = await this.streamService.getStreamByMemberId(memberId);
    if (stream == null) {
      throw new BadRequestException('Streamer mode not activated.');
    }
    return StreamDto.from(stream);
  }

  @ApiOperation({
    summary: '스트리머 모드 비활성화',
    description: '스트리머 모드를 비활성화 합니다.',
  })
  @ApiOkResponse({
    description: '스트리머 모드 비활성화 성공',
    schema: {
      type: 'object',
      properties: {
        success: {
          type: 'boolean',
        },
      },
      example: {
        success: true,
      },
    },
  })
  @ApiBearerAuth()
  @ApiCookieAuth()
  @UseGuards(MemberGuard)
  @HttpCode(HttpStatus.OK)
  @Delete('disable')
  public async disableStream(
    @MemberAuth() memberId: number,
  ) {
    const deactivate = await this.streamService.deactivateStream(memberId);
    return {
      success: (deactivate.affected || 0) > 0,
    };
  }

  @Post('trigger/start-stream')
  public startStreamTrigger(
    @Req() req: Request,
    @Body() payload: any,
  ) {
    console.log(payload);
    console.log('start');
    console.log(req.method);
    console.log(req.params);
    console.log(req.query);
    console.log(req.body);
    return true;
  }


  @Post('trigger/end-stream')
  public endStreamTrigger(
    @Req() req: Request,
  ) {
    console.log('end');
    console.log(req.method)
    console.log(req.query);
    console.log(req.body);
    return true;
  }
}
