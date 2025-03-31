export type Streaming = {
  id: number,
  name: string,
  description: string,
  thumbnailImage: string,
  streamKey: string,
  isLive: boolean,
  streamer: Streamer,
};

export type Streamer = {
  id: number,
  nickname: string,
  profileImage: string,
};
