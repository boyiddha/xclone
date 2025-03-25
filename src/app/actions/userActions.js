export const getLoggedInUser = async () => {
  const apiUrl =
    typeof window !== "undefined" && window.location.origin
      ? `${window.location.origin}/api/me`
      : "/api/me"; // Fallback for server-side or other cases

  try {
    const res = await fetch(apiUrl, { method: "GET" });

    if (res.ok) {
      const data = await res.json();
      return data; // Return the fetched user data
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

// don't need merge getUserByIdentifier and fetchUserData functions into same functions
// due to server and client environgment. server side need to use API_SERVER_BASE_URL (client side may exposing sensetive server side data)

export const fetchUserData = async (username) => {
  try {
    const res = await fetch(`/api/users/${username}`);
    if (!res.ok) throw new Error("Failed to fetch user");

    return await res.json(); // { user: { fullName, userName, image, _id, following, followers } }
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
};

export const fetchUsersData = async () => {
  try {
    const res = await fetch("/api/users");
    if (!res.ok) throw new Error("Failed to fetch users");
    const data = await res.json();
    return data; // Return fetched data
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error; // Throw error to be handled on the frontend
  }
};

export const updateUserAPI = async (userId, updatedData) => {
  try {
    const response = await fetch(`/api/users/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedData),
    });

    if (!response.ok) {
      throw new Error("Something went wrong");
    }

    return await response.json(); // Return the updated user data
  } catch (error) {
    console.error("Error updating user:", error);
    throw error; // Rethrow error to be handled in the frontend
  }
};
