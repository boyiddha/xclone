import Post from "@/models/postModel";

export const savePost = async (userId, content, media) => {
  const newPost = new Post({ userId, content, media });
  return await newPost.save();
};

//return all post associated with this userId
export const findPostsByUserId = async (userId) => {
  return await Post.find({ userId }).sort({ createdAt: -1 });
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

// export const toggleRepost = async (postId, userId) => {
//   const post = await findPostByPostId(postId);
//   const hasReposted = post.reposts.includes(userId);

//   const updatedPost = await Post.findOneAndUpdate(
//     { _id: postId },
//     hasReposted
//       ? { $pull: { reposts: userId } }
//       : { $addToSet: { reposts: userId } },
//     { new: true }
//   );

//   return { reposts: updatedPost.reposts.length, reposted: !hasReposted };
// };

export const toggleRepost = async (postId, userId) => {
  try {
    const post = await Post.findById(postId);
    if (!post) {
      throw new Error("Post not found");
    }

    const hasReposted = post.reposts.includes(userId);
    let newRepost = null;
    // Update the original post's reposts array
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      hasReposted
        ? { $pull: { reposts: userId } } // Remove user from reposts
        : { $addToSet: { reposts: userId } }, // Add user to reposts
      { new: true }
    );

    if (hasReposted) {
      // If user already reposted, delete their reposted post
      await Post.findOneAndDelete({ userId, reposted: postId });
    } else {
      // If user is reposting for the first time, create a new reposted post
      newRepost = await Post.create({
        userId,
        content: "",
        media: {},
        likes: [],
        reposts: [],
        reposted: postId, // Store the original post ID
      });
    }

    return {
      reposts: updatedPost.reposts.length,
      reposted: !hasReposted,
      newPost: newRepost,
    };
  } catch (error) {
    console.error("❌ Error in toggleRepost:", error);
    throw new Error("Failed to toggle repost");
  }
};
