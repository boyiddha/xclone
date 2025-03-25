export const searchUsers = async (query) => {
  try {
    const res = await fetch(`/api/searchUsers?query=${query}`);
    const data = await res.json();
    return data.users; // Return the list of users from the API
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error; // Throw the error to be handled in the frontend
  }
};
