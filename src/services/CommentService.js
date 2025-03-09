import {
  createCommentInDB,
  getCommentsByPostId,
} from "@/repositories/commentRepository";

export async function addComment(postId, currentUserId, content) {
  return await createCommentInDB(postId, currentUserId, content);
}

export async function fetchComments(postId) {
  return await getCommentsByPostId(postId);
}
