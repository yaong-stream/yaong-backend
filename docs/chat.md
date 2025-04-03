# 라이브 스트리밍 채팅 WebSocket API 문서
라이브 스트리밍 서비스의 실시간 채팅 기능을 위한 WebSocket API를 설명합니다.

## 연결 정보
- Protocol: [socket.io](https://socket.io)
- NameSpace: /chat

### 인증
채팅 발신 이벤트는 JWT 토큰 기반 인증이 필요합니다. 연결 시 다음과 같이 헤더에 인증 토큰을 포함해야 합니다:

```javascript
const socket = io('/chat', {
  transports: ['websocket'],
  extraHeaders: {
    'Authorization': 'Bearer YOUR_JWT_TOKEN'
  }
});
```

혹은, Cookie 기반 인증이 되어 있어야 합니다.

## 송신 이벤트

### 채팅방 입장 (chat-join)
특정 스트리밍 채팅방에 입장할 때 사용합니다. 이전에 참여했던 모든 채팅방에서 자동으로 나가게 됩니다.

```javascript
socket.emit('chat-join', {
  streamId: 12345   // 입장할 스트리밍 ID (숫자)
});
```

필수 파라미터:
- streamId: 숫자 타입, 입장할 스트리밍 채널의 ID

### 메시지 전송 (chat-message, auth required)
채팅 메시지를 전송할 때 사용합니다.

```javascript
socket.emit('chat-message', {
  message: '안녕하세요!'    // 전송할 메시지 내용
});
```
필수 파라미터:
- message: 문자열 타입, 전송할 메시지 내용

### 채팅방 나가기 (chat-leave)
모든 채팅방에서 나갈 때 사용합니다.

```javascript
socket.emit('chat-leave');
```

## 수신 이벤트
### 채팅 메시지 수신 (chat-message)
다른 사용자가 보낸 메시지를 수신할 때 발생합니다.

```javascript
socket.on('chat-message', (data) => {
  console.log(data.id)                      // 메시지 ID
  console.log(data.message);                // 메시지 내용
  console.log(data.member.id);              // 사용자 ID
  console.log(data.member.nickname);        // 사용자 닉네임
  console.log(data.member.profileImage);    // 프로필 이미지 URL
});
```

응답 데이터 구조:
```typescript
{
  id: string                // 메시지 ID
  message: string;          // 메시지 내용
  member: {
    id: string;             // 사용자 ID
    nickname: string;       // 사용자 닉네임
    profileImage: string;   // 프로필 이미지 URL (null 가능)
  }
}
```

### 오류 수신 (exception)
소켓통신중 오류가 발생한 경우 발생합니다.

```javascript
socket.on('exception', (data)=> {
  console.log(data.code);         // 오류 코드
  console.log(data.detail);       // 상세 오류 내용
  console.log(data.parameter)     // 오류 코드가 BadRequest일떄, 파라미터 값 
  console.log(data.timestamp);    // 오류 발생 시간
});
```

응답 데이터 구조:
```typescript
{
  code: string;         // 오류 코드
  detail: string;       // 상세 오류 내용
  parameter: string;    // 오류 코드가 BadRequest일떄, 파라미터 값 
  timestamp: string;    // 오류 발생 시간
}
```
