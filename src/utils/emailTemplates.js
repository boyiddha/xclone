export const generateEmailData = (type, email, data) => {
    switch (type) {
      case "emailVerification":
        return {
          to: email,
          subject: `${data.otp} is your X verification code`,
          html: `
            <h1>Confirm your email address</h1>
            <br/>
            <h3>There’s one quick step you need to complete before creating your X account. 
            Let’s make sure this is the right email address for you — please confirm this 
            is the right address to use for your new account.</h3>
            <br/>
            <h3>Please enter this verification code to get started on X:</h3>
            <h1>${data.otp}</h1>
            <br/>
            <h3>Verification codes expire after 3 minutes.</h3>
            <br/>
            <h4>Thanks,</h4>
            <h4>X</h4>
          `,
        };
  
      case "passwordResetVerification":
        return {
          to: email,
          subject: "Password reset request",
          html: `
            <h1>Reset your password?</h1>
            <br/>
            <h3>If you requested a password reset for @${data.userName}, use the confirmation code below to complete the process. 
            If you didn't make this request, ignore this email.</h3>
            <br/><br/>
            <h2>${data.resetCode}</h2>
            <br/>
            <h3>Verification codes expire after 1 hour.</h3>
            <br/>
            <h4>Thanks,</h4>
            <h4>X</h4>
          `,
        };
  
      default:
        throw new Error("Invalid email type provided.");
    }
  };
  