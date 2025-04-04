export type Streaming = {
  id: number,
  name: string,
  description: string,
  thumbnailImage: string,
  streamKey: string,
  isLive: boolean,
  followers: number,
  category: StreamCategory,
  streamer: Streamer,
};

export type Streamer = {
  id: number,
  nickname: string,
  profileImage: string,
};

export type StreamCategory = {
  id: number,
  name: string,
  thumbnailImage: string,
};

export type StreamFollowing = {
  id: number,
  stream: Streaming,
};
