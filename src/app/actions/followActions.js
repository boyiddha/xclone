export const toggleFollow = async (loggedInUserId, userId) => {
  try {
    const response = await fetch("/api/follow", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ loggedInUserId, userId }),
    });

    if (!response.ok) throw new Error("Failed to toggle follow");

    return await response.json(); // { isFollowing }
  } catch (error) {
    console.error("Error following/unfollowing:", error);
    throw error;
  }
};
