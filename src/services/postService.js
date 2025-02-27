import { findUserByEmail } from "@/services/userService";
import { createPostInDB, findPostsByUser } from "@/repositories/postRepository";

export async function createNewPost(email, content) {
  const res = await findUserByEmail(email);
  if (!res.success) return null;
  const user = res.user;

  return createPostInDB(user._id, content);
}

export async function fetchUserPosts(email) {
  const res = await findUserByEmail(email);
  if (!res.success) return null;
  const user = res.user;
  return findPostsByUser(user._id);
}
