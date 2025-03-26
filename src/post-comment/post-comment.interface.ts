export type CommentMember = {
  id: number,
  nickname: string,
  profileImage: string,
}

export type Comment = {
  id: number,
  content: string,
  replyCount: number,
  createdAt: Date,
  updatedAt: Date,
  member: CommentMember,
};
