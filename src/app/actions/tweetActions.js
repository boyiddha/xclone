export const fetchRepliedPost = async (repliedPostId) => {
  try {
    const res = await fetch(`/api/tweet/posts/${repliedPostId}`);

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
