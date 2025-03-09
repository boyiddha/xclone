import {
  savePost,
  findPostsByUserId,
  findPostByPostId,
  toggleLikeOnPost,
  toggleRepost,
  findAllPosts,
  findPostById,
  deletePost,
} from "@/repositories/postRepository";

const convertToBase64 = async (file) => {
  const buffer = await file.arrayBuffer();
  return Buffer.from(buffer).toString("base64");
};

export const createPostService = async (userId, content, file) => {
  if (file === null || file === undefined) {
    // console.log("❌ No file uploaded, skipping media.");
    return await savePost(userId, content, null);
  }

  let media = null;
  if (file instanceof Blob) {
    media = {
      name: file.name || "unknown",
      data: await convertToBase64(file),
      contentType: file.type || "application/octet-stream",
    };
  } else {
    //console.error("❌ Invalid file format:", file);
    return await savePost(userId, content, null); // Save without media
  }

  return await savePost(userId, content, media);
};

export const getUserPostsService = async (userId) => {
  return await findPostsByUserId(userId);
};

export const getAllPostsService = async () => {
  return await findAllPosts();
};

export const likePostService = async (postId, userId) => {
  const post = await findPostByPostId(postId);

  if (!post) {
    return { success: false, message: "Post not found", status: 404 };
  }

  const { likes, liked } = await toggleLikeOnPost(postId, userId);
  return { success: true, likes, liked };
};

export const repostService = async (postId, userId, content) => {
  const post = await findPostByPostId(postId);

  if (!post) {
    return { success: false, message: "Post not found", status: 404 };
  }

  const { reposts, reposted, newPost, removedRepostId } = await toggleRepost(
    postId,
    userId,
    content
  );
  return { success: true, reposts, reposted, newPost, removedRepostId };
};

export async function fetchPost(postId) {
  return await findPostById(postId);
}

export async function removePost(postId) {
  return await deletePost(postId);
}
