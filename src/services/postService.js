import { savePost, findPostsByUserId } from "@/repositories/postRepository";

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
