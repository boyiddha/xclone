import Post from "@/models/postModel";
import { User } from "@/models/userModel";

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

export async function findPostById(postId) {
  return await Post.findById(postId)
    .populate({
      path: "userId",
      model: "User", // ✅ Explicitly specify the model
      select: "fullName userName image", // Get user info
    })
    .populate({
      path: "reposted",
      populate: {
        path: "userId",
        model: "User",
        select: "fullName userName image",
      },
      select: "content media userId likes reposts comments",
    })
    .populate({
      path: "parentPostId", // Get parent post ID if it's a reply
      populate: {
        path: "userId",
        model: "User",
        select: "fullName userName image",
      },
      select: "content media likes reposts comments",
    })
    .populate({
      path: "comments",
      populate: {
        path: "userId",
        model: "User",
        select: "fullName userName image",
      },
      select: "content media likes reposts comments",
    })
    .populate({
      path: "comments",
      populate: {
        path: "comments", // Fetch child comments recursively
        populate: {
          path: "userId",
          model: "User",
          select: "fullName userName image",
        },
        select: "content media likes reposts comments",
      },
    });
}

export async function deletePost(postId) {
  return await Post.findByIdAndDelete(postId);
}
