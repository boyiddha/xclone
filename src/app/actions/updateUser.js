export const saveNewOauthUser = async ({ dob, password, username }) => {
    const response = await fetch("/api/auth/saveOauthNewUser", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ dob, password, username }),
    });
  
    return response;
  };
  