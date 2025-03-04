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
//   try {
//     const post = await Post.findById(postId);
//     if (!post) {
//       throw new Error("Post not found");
//     }

//     const hasReposted = post.reposts.includes(userId);
//     let newRepost = null;
//     let removedRepostedId = null;
//     // Update the original post's reposts array
//     const updatedPost = await Post.findByIdAndUpdate(
//       postId,
//       hasReposted
//         ? { $pull: { reposts: userId } } // Remove user from reposts
//         : { $addToSet: { reposts: userId } }, // Add user to reposts
//       { new: true }
//     );

//     if (hasReposted) {
//       // If user already reposted, delete their reposted post
//       const removedRepost = await Post.findOneAndDelete({
//         userId,
//         reposted: postId,
//       });
//       removedRepostedId = removedRepost ? removedRepost._id : null;
//     } else {
//       // If user is reposting for the first time, create a new reposted post
//       newRepost = await Post.create({
//         userId,
//         content: "",
//         media: {},
//         likes: [],
//         reposts: [],
//         reposted: postId, // Store the original post ID
//       });
//     }

//     return {
//       reposts: updatedPost.reposts.length,
//       reposted: !hasReposted,
//       newPost: newRepost,
//       removedRepostedId, // return removed repost id when undo repost
//     };
//   } catch (error) {
//     console.error("❌ Error in toggleRepost:", error);
//     throw new Error("Failed to toggle repost");
//   }
// };

export const toggleRepost = async (postId, userId) => {
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
        content: "",
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
