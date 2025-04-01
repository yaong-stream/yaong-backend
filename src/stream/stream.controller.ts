import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Header,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  Param,
  Patch,
  Post,
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
  v4 as uuidv4,
} from 'uuid';
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
import {
  MistService,
} from './mist.service';

@ApiTags('Stream')
@Controller()
export class StreamController {

  private readonly logger = new Logger(StreamController.name);

  constructor(
    private readonly streamService: StreamService,
    private readonly memberService: MemberService,
    private readonly mistService: MistService,
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
      const generatedKey = uuidv4().replace(/-/g, '');;
      const auth = await this.mistService.authenticate();
      if (!auth) {
        throw new InternalServerErrorException('Fail to Authrization on mist server.');
      }
      const isCreatedStream = await this.mistService.createStream(generatedKey);
      if (!isCreatedStream) {
        throw new InternalServerErrorException('Fail to create stream on mist server.');
      }
      const stream = await this.streamService.activateStream(member.id, member.nickname, generatedKey);
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

  /**
   * 
   * @param body 
   * stream name (string)
   * connection address (string)
   * connector (string)
   * request url (string)
   * 
   */
  @Post('trigger/start-stream')
  public async startStreamTrigger(
    @Body() body: string,
  ) {
    const [
      streamName,
      connectionAddress,
      connector,
      requestUrl,
    ] = body.split(/\r\n|\r|\n/);
    const stream = await this.streamService.getStreamByStreamKey(streamName);
    if (stream == null) {
      throw new NotFoundException('Stream not found.');
    }
    await this.streamService.createStreamHistory(stream);
    return 'true';
  }

  /**
   * stream name (string)
   * input type (string)
   * 9d91ddf5472d4d81a9accd5fbc528aa1
   * Buffer
   * uncancelablesource disconnected for non-resumable stream
   */
  @Header('Content-Type', 'text/plain')
  @Post('trigger/end-stream')
  public async endStreamTrigger(
    @Body() body: string,
  ) {
    const [
      streamName,
      inputType,
      reason,
    ] = body.split(/\r\n|\r|\n/);
    await this.streamService.endStreamHistory(streamName);
    return 'true';
  }

  @ApiOperation({
    summary: '생방송 정보 목록',
    description: '생방송 중인 스트리머의 방송 정보를 가져옵니다.',
  })
  @ApiOkResponse({
    type: [StreamDto],
    description: '방송 정보',
  })
  @HttpCode(HttpStatus.OK)
  @Get()
  public async getLiveStreams() {
    const streams = await this.streamService.getLiveStreams();
    return streams.map((stream) => StreamDto.from(stream));
  }

  @ApiOperation({
    summary: '방송 정보',
    description: '스트리머의 방송 정보를 가져옵니다.',
  })
  @ApiOkResponse({
    type: StreamDto,
    description: '방송 정보',
  })
  @HttpCode(HttpStatus.OK)
  @Get(':streamer_name')
  public async getStream(
    @Param('streamer_name') streamerName: string,
  ) {
    const stream = await this.streamService.getStreamByStreamerName(streamerName);
    if (stream == null) {
      throw new NotFoundException('Streamer not found.');
    }
    return StreamDto.from(stream);
  }
}
