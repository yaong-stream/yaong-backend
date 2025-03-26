export interface PostWithLikeCount {
  id: number;
  content: string;
  likeCount: number;
  createdAt: Date;
  updatedAt: Date;
  member: PostMember;
}

export interface PostMember {
  id: number;
  nickname: string;
  profileImage: string;
}
