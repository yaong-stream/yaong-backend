export type CommentMember = {
  id: number,
  nickname: string,
  profileImage: string,
}

export type Comment = {
  id: number,
  content: string,
  likeCount: number,
  replyCount: number,
  createdAt: Date,
  updatedAt: Date,
  member: CommentMember,
};

export type CommentReply = {
  id: number,
  content: string,
  likeCount: number,
  createdAt: Date,
  updatedAt: Date,
  member: CommentMember,
};
