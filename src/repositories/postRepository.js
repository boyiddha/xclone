import Post from "@/models/postModel";

export const savePost = async (userId, content, media) => {
  const newPost = new Post({ userId, content, media });
  return await newPost.save();
};

//return all post associated with this userId
export const findPostsByUserId = async (userId) => {
  return await Post.find({ userId }).sort({ createdAt: -1 });
};

// return all posts from db
export const findAllPosts = async () => {
  return await Post.find().sort({ createdAt: -1 });
};

// return a post associtae with this postId
export const findPostByPostId = async (postId) => {
  return await Post.findById(postId);
};

export const toggleLikeOnPost = async (postId, userId) => {
  const post = await findPostByPostId(postId);
  const hasLiked = post.likes.includes(userId);

  const updatedPost = await Post.findOneAndUpdate(
    { _id: postId },
    hasLiked ? { $pull: { likes: userId } } : { $addToSet: { likes: userId } },
    { new: true }
  );

  return { likes: updatedPost.likes.length, liked: !hasLiked };
};

export const toggleRepost = async (postId, userId, content) => {
  try {
    let post = await Post.findById(postId);
    if (!post) {
      throw new Error("Post not found");
    }

    // Find the original post if this is a repost
    const originalPostId = post.reposted ? post.reposted : postId;

    const hasReposted = post.reposts.includes(userId);
    let newRepost = null;
    let removedRepostId = null;

    // Update the original post's reposts array
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      hasReposted
        ? { $pull: { reposts: userId } } // Remove user from reposts
        : { $addToSet: { reposts: userId } }, // Add user to reposts
      { new: true }
    );

    if (hasReposted) {
      // First, find the reposted post before deleting
      const removedRepost = await Post.findOne({
        userId,
        reposted: originalPostId,
      });

      if (removedRepost) {
        removedRepostId = removedRepost._id; // Store its ID before deletion
        //console.log("✅  removed repost id: ", removedRepostId);
        await Post.findByIdAndDelete(removedRepostId); // Now safely delete
      }
    } else {
      // If user is reposting a repost, make sure it references the original post
      newRepost = await Post.create({
        userId,
        content,
        media: {},
        likes: [],
        reposts: [],
        reposted: originalPostId, // Always link to the root/original post
      });
    }

    return {
      reposts: updatedPost.reposts.length,
      reposted: !hasReposted,
      newPost: newRepost,
      removedRepostId, // Return the removed repost ID when undoing a repost
    };
  } catch (error) {
    console.error("❌ Error in toggleRepost:", error);
    throw new Error("Failed to toggle repost");
  }
};

//✅  convert image into base64 and save it in db

// import fs from "fs/promises"; // Use fs.promises for async operations
// import Post from "@/models/postModel";
// import { User } from "@/models/userModel";

// /**
//  * Converts a file object to a Base64 string.
//  * @param {File} file - The uploaded file object.
//  * @returns {Promise<string>} - Base64 encoded image string.
//  */
// const fileToBase64 = async (file) => {
//   try {
//     const buffer = await file.arrayBuffer(); // Read file as buffer
//     const base64String = Buffer.from(buffer).toString("base64");
//     const fileType = file.type.split("/")[1]; // Extract file extension
//     return `data:image/${fileType};base64,${base64String}`;
//   } catch (error) {
//     console.error("Error converting file to base64:", error);
//     throw new Error("File conversion failed");
//   }
// };

// /**
//  * Saves a post and stores the image in Base64 format.
//  * @param {string} userId - User ID.
//  * @param {string} content - Post content.
//  * @param {string} media - Media information.
//  * @param {File} file - Uploaded image file.
//  * @returns {Promise<object>} - The saved post.
//  */
// export const savePost = async (userId, content, media, file) => {
//   try {
//     if (!file) throw new Error("No file provided");

//     // Convert the image file to Base64
//     const base64Image = await fileToBase64(file);

//     // Update user's profile image in DB
//     const user = await User.findByIdAndUpdate(
//       userId,
//       { $set: { image: base64Image } },
//       { new: true }
//     );

//     console.log("User updated:", user);

//     // Create and save the new post
//     const newPost = new Post({ userId, content, media });
//     return await newPost.save();
//   } catch (error) {
//     console.error("Error saving post:", error);
//     throw new Error("Failed to save post");
//   }
// };
