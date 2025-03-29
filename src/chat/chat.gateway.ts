import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import {
  UseFilters,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  Server,
  Socket,
} from 'socket.io';
import {
  SocketExceptionFilter,
} from 'src/exception/socket-exception-filter';
import {
  RedisService,
} from 'src/redis/redis.service';
import {
  MemberService,
} from 'src/member/member.service';
import {
  ChatJoinRoom,
  ChatMessage,
} from './dto/request';
import {
  ChatService,
} from './chat.service';
import {
  ChatGuard,
} from './chat.guard';

const ROOM_PREFIX = 'streaming-chat-';
const MEMBER_PREFIX = 'members:';
const CACHE_TTL = 3600;

@UseFilters(SocketExceptionFilter)
@UsePipes(new ValidationPipe({ exceptionFactory: (error) => new WsException(error) }))
@WebSocketGateway({
  cors: {
    origin: (origin, callback) => {
      if (!origin || process.env.NODE_ENV !== 'production') {
        return callback(null, true);
      }
      if (/^(https?:\/\/)?(([\w\d-\.]*)?\.)?narumir.io/.test(origin)) {
        return callback(null, true);
      }
      return callback(null, false);
    },
    methods: ['GET', 'POST'],
    credentials: true,
  },
  transports: ['websocket'],
  namespace: 'chat',
})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer()
  private readonly io: Server;

  constructor(
    private readonly chatService: ChatService,
    private readonly redisService: RedisService,
    private readonly memberService: MemberService,
  ) { }

  afterInit(server: Server) {
  }

  handleConnection(client: Socket, ...args: any[]) {
    console.log(client.id);
  }

  handleDisconnect(client: Socket) {
    this.leaveAllChatRooms(client);
  }

  @UseGuards(ChatGuard)
  @SubscribeMessage('chat-join')
  handleChatJoin(client: Socket, payload: ChatJoinRoom) {
    this.leaveAllChatRooms(client);
    client.join(`${ROOM_PREFIX}${payload.streamId}`);
  }

  @UseGuards(ChatGuard)
  @SubscribeMessage('chat-message')
  async handleChatMessage(client: Socket, payload: ChatMessage) {
    const memberId = client.data['sub'];
    let member = await this.redisService.hgetAll(`${MEMBER_PREFIX}${memberId}`);
    if (!member || Object.keys(member).length === 0 || member['id'] == null) {
      const mem = await this.memberService.getMemberById(memberId);
      if (mem == null) {
        throw new WsException('MemberNotFound');
      }
      await this.redisService.hset(`${MEMBER_PREFIX}${memberId}`, {
        id: mem.id,
        nickname: mem.nickname,
        profileImage: mem.profileImage,
      });
      member['id'] = mem.id.toString();
      member['nickname'] = mem.nickname;
      member['profileImage'] = mem.profileImage;
    }

    await this.redisService.expire(`${MEMBER_PREFIX}${memberId}`, CACHE_TTL);
    client.rooms.forEach((room) => {
      if (room.startsWith(ROOM_PREFIX)) {
        this.io.to(room).emit('chat-message', {
          message: payload.message,
          member: {
            id: member['id'],
            nickname: member['nickname'],
            profileImage: member['profileImage'],
          },
        });
      }
    });

    const roomKeys: number[] = [];
    client.rooms.forEach((room) => {
      if (room.startsWith(ROOM_PREFIX)) {
        const streamId = this.getStreamIdFromRoom(room);
        if (streamId != null) {
          roomKeys.push(streamId)
        }
      }
    });
    await Promise.all(roomKeys.map(async (key) => {
      await this.chatService.createChatHistory(key, memberId, payload.message);
    }));
  }

  @SubscribeMessage('chat-leave')
  handleChatLeave(client: Socket) {
    this.leaveAllChatRooms(client);
  }

  private getStreamIdFromRoom(room: string) {
    const match = room.match(/streaming-chat-(\d+)/);
    return match && match[1] ? parseInt(match[1], 10) : null;
  }

  private leaveAllChatRooms(client: Socket) {
    client.rooms.forEach((room) => {
      if (room.startsWith(ROOM_PREFIX)) {
        client.leave(room);
      }
    });
  }
}
