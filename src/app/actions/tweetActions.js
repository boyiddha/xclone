export const createPost = async (file, content) => {
  const data = new FormData();
  data.append("file", file);
  data.append("content", content);

  try {
    const res = await fetch("/api/tweet/posts", {
      method: "POST",
      body: data,
    });

    if (res.ok) {
      const result = await res.json();
      return result; // Return the result to be handled in the frontend
    } else {
      throw new Error("File Upload Failed");
    }
  } catch (error) {
    console.error("Upload Error:", error);
    throw error;
  }
};

export const fetchPost = async (PostId) => {
  try {
    const res = await fetch(`/api/tweet/posts/${PostId}`);

    if (res.ok) {
      const data = await res.json();
      return data.post;
    } else {
      console.error("Failed to fetch reposted post");
      return null;
    }
  } catch (error) {
    console.error("Error fetching reposted post:", error);
    return null;
  }
};

export const postLike = async ({ postId, currentUserId }) => {
  try {
    const res = await fetch("/api/tweet/like", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postId, currentUserId }),
    });

    if (res.ok) {
      const data = await res.json();
      return { liked: data.liked, likeCount: data.likes };
    }
    throw new Error("Failed to like the post");
  } catch (error) {
    console.error("Error liking post:", error);
    throw error; // rethrow to handle it in the component
  }
};

export const postReply = async ({ repliedPostId, currentUserId, content }) => {
  try {
    const res = await fetch("/api/tweet/reply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        postId: repliedPostId,
        currentUserId,
        content,
      }),
    });

    const result = await res.json();
    return { result, res };
  } catch (error) {
    console.error("Error posting reply:", error);
    throw new Error("Something went wrong. Please try again.");
  }
};

export const repostTweet = async ({ repostedId, currentUserId, content }) => {
  try {
    const res = await fetch("/api/tweet/repost", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postId: repostedId, currentUserId, content }),
    });

    if (!res.ok) throw new Error("Repost failed");

    return await res.json();
  } catch (error) {
    console.error("Error reposting tweet:", error);
    throw error;
  }
};

export const deletePost = async (postId) => {
  try {
    const response = await fetch(`/api/tweet/posts/${postId}`, {
      method: "DELETE",
    });

    const result = await response.json();

    if (!response.ok) {
      console.error(result.message || "Failed to delete post");
      return false;
    }

    return true; // Return success if post is deleted
  } catch (error) {
    console.error("Error deleting post:", error);
    return false;
  }
};

export const fetchAllPostsData = async () => {
  try {
    const response = await fetch("/api/posts", {
      method: "GET",
    });

    const result = await response.json();
    if (result.success) {
      return result.posts;
    } else {
      console.error("Failed to fetch posts");
      return []; // Return an empty array if posts fetch fails
    }
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw new Error("Failed to fetch posts " + error.message); // Rethrow error to be handled on the client side
  }
};

export const fetchUserPosts = async (username) => {
  try {
    const res = await fetch(`/api/posts/${username}`);
    const data = await res.json();
    if (data.success) {
      return data.posts; // Return posts if successful
    } else {
      console.error("Failed to fetch posts");
      return []; // Return an empty array if fetching fails
    }
  } catch (error) {
    console.error("Error fetching user posts:", error);
    return []; // Return an empty array in case of an error
  }
};
