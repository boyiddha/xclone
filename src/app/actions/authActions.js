export const checkAlreadyUseThisEmail = async (email) => {
  try {
    const res = await fetch(
      `/api/auth/users?email=${encodeURIComponent(email)}`
    );

    if (!res.ok) throw new Error("Failed to fetch user data");

    return await res.json();
  } catch (err) {
    console.error("Error finding user:", err);
    throw err;
  }
};

export const generateOTP = async (email) => {
  try {
    const res = await fetch("/api/auth/createOTP", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (!res.ok) throw new Error("Failed to generate OTP");

    return await res.json(); // { otp }
  } catch (error) {
    console.error("✅ Error generating OTP:", error);
    throw error;
  }
};

export const sendEmail = async (email, type, data) => {
  try {
    const res = await fetch("/api/auth/nodemailer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, type, data }),
    });

    if (!res.ok) throw new Error("Failed to send email");

    return await res.json(); // { message }
  } catch (error) {
    console.error("✅ Error sending email:", error);
    throw error;
  }
};

export const verifyOTP = async (email, verificationCode) => {
  try {
    const res = await fetch("/api/auth/verifyOTP", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, verificationCode }),
    });

    return await res.json();
  } catch (error) {
    console.error("Error verifying OTP:", error);
    throw error;
  }
};

export const registerUser = async ({ name, email, dob }) => {
  try {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name, email, dob }),
    });

    return res;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};

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

export const requestPasswordReset = async (email) => {
  try {
    const response = await fetch("/api/auth/forgot-password/request", {
      method: "POST",
      body: JSON.stringify({ email }),
      headers: { "Content-Type": "application/json" },
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to send reset code");
    }

    return data; // Return data if needed
  } catch (error) {
    console.error("Error sending reset code:", error);
    throw error; // Throw error to be handled on the frontend
  }
};

export const verifyResetCode = async ({ email, code }) => {
  try {
    const res = await fetch("/api/auth/forgot-password/verify", {
      method: "POST",
      body: JSON.stringify({ email, code }),
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Failed to verify the code");
    }

    return data; // Return the response data if successful
  } catch (error) {
    console.error("Error verifying reset code:", error);
    throw error; // Throw the error to be handled on the frontend
  }
};

export const updatePasswordAPI = async ({ email, newPassword }) => {
  try {
    const res = await fetch("/api/auth/forgot-password/update", {
      method: "POST",
      body: JSON.stringify({ email, newPassword }),
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Failed to update password");
    }

    return data; // Return the response data if successful
  } catch (error) {
    console.error("Error updating password:", error);
    throw error; // Throw the error to be handled on the frontend
  }
};

export const savePasswordAPI = async ({ email, password }) => {
  try {
    const saveResponse = await fetch("/api/auth/savePassword", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!saveResponse.ok) {
      throw new Error("Failed to save password");
    }

    return saveResponse; // Return the response if successful
  } catch (e) {
    console.error("Error saving password:", e.message);
    throw e; // Rethrow error to be handled in frontend
  }
};

export const saveUserNameAPI = async ({ email, username }) => {
  try {
    const saveResponse = await fetch("/api/auth/saveUserName", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, username }),
    });

    if (!saveResponse.ok) {
      throw new Error("Failed to save username");
    }

    return saveResponse; // Return the response if successful
  } catch (e) {
    console.error("Error saving username:", e.message);
    throw e; // Rethrow error to be handled in frontend
  }
};

export const fetchNewAccessToken = async (refreshToken) => {
  try {
    //console.log("📤 received refresh token:", refreshToken); // Debugging
    // Debuggin: Ensure refreshToken is available before API Call
    if (!refreshToken) {
      //console.error("❌ refreshToken is missing before making API call!");
      return { error: "Missing refresh token" };
    }

    const response = await fetch(
      `${process.env.API_SERVER_BASE_URL}/api/auth/refresh`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${refreshToken}`,
        },
        body: JSON.stringify({ refreshToken }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Server Error response:", errorText);
      return { error: "RefreshTokenExpired" };
    }

    const text = await response.text();
    // If the response is empty, log a warning

    if (!text) {
      console.warn("⚠️ Empty response received from the server.");
      return { error: "Empty response received" };
    }
    // Parse the response as JSON

    return JSON.parse(text);
  } catch (error) {
    console.error("❌ Refresh token error:", error);
    return { error: "RefreshTokenExpired" };
  }
};
