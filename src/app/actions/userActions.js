export const getLoggedInUser = async () => {
  try {
    const res = await fetch("/api/me", { method: "GET" });

    if (res.ok) {
      const data = await res.json();
      return data; // Return the user data
    } else {
      console.error("Failed to fetch user data");
      return null; // Return null if the request fails
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null; // Return null if an error occurs
  }
};

export const getUserByIdentifier = async (userId) => {
  try {
    const res = await fetch(
      `${process.env.API_SERVER_BASE_URL}/api/users/${userId}`
    );

    if (!res.ok) {
      throw new Error("Failed to fetch user data");
    }

    const data = await res.json();
    return data?.user || {}; // ✅ Ensure a plain object is returned
  } catch (error) {
    console.error("Error fetching user data:", error);
    return {}; // ✅ Return an empty object instead of null
  }
};
