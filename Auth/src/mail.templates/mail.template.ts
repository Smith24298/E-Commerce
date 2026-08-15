export const registerTemplate = (
  name: string,
  email: string,
  token: string
) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Verify Your Email</title>
    </head>

    <body style="
      margin: 0;
      padding: 0;
      background-color: #f4f4f5;
      font-family: Arial, Helvetica, sans-serif;
    ">
      <div style="
        max-width: 600px;
        margin: 40px auto;
        background-color: #ffffff;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 4px 12px rgba(0,0,0,0.08);
      ">

        <!-- Header -->
        <div style="
          background-color: #111827;
          padding: 30px;
          text-align: center;
        ">
          <h1 style="
            margin: 0;
            color: #ffffff;
            font-size: 28px;
          ">
            Welcome to Smith Faldu
          </h1>
        </div>

        <!-- Content -->
        <div style="padding: 40px 35px;">

          <h2 style="
            margin-top: 0;
            color: #111827;
          ">
            Hello ${name}! 👋
          </h2>

          <p style="
            color: #4b5563;
            font-size: 16px;
            line-height: 1.6;
          ">
            Thanks for creating an account with us.
            Please verify your email address to activate your account.
          </p>

          <p style="
            color: #4b5563;
            font-size: 15px;
          ">
            <strong>Email:</strong> ${email}
          </p>

          <!-- Button -->
          <div style="
            text-align: center;
            margin: 35px 0;
          ">
            <a
              href="https://smithfaldu.tech/api/auth/verify-email?token=${token}"
              style="
                display: inline-block;
                padding: 14px 28px;
                background-color: #2563eb;
                color: #ffffff;
                text-decoration: none;
                border-radius: 8px;
                font-size: 16px;
                font-weight: bold;
              "
            >
              Verify Email
            </a>
          </div>

          <p style="
            color: #6b7280;
            font-size: 14px;
            line-height: 1.6;
          ">
            This verification link will expire soon. If you didn't create
            this account, you can safely ignore this email.
          </p>

          <p style="
            color: #6b7280;
            font-size: 13px;
            line-height: 1.6;
            word-break: break-all;
          ">
            If the button doesn't work, copy and paste this URL into your browser:
            <br />
            https://smithfaldu.tech/api/auth/verify-email?token=${token}
          </p>

        </div>

        <!-- Footer -->
        <div style="
          background-color: #f9fafb;
          padding: 20px;
          text-align: center;
        ">
          <p style="
            margin: 0;
            color: #9ca3af;
            font-size: 12px;
          ">
            © ${new Date().getFullYear()} Smith Faldu. All rights reserved.
          </p>
        </div>

      </div>
    </body>
    </html>
  `;
};

export const resetPasswordTemplate = (
  name: string,
  token: string,
  email: string
) => {
  const resetUrl = `https://smithfaldu.tech/reset-password?token=${encodeURIComponent(token)}`;

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
      />
      <title>Reset Your Password</title>
    </head>

    <body style="
      margin: 0;
      padding: 0;
      background-color: #f4f4f5;
      font-family: Arial, Helvetica, sans-serif;
    ">
      <div style="
        max-width: 600px;
        margin: 40px auto;
        background-color: #ffffff;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 4px 12px rgba(0,0,0,0.08);
      ">

        <!-- Header -->
        <div style="
          background-color: #111827;
          padding: 30px;
          text-align: center;
        ">
          <h1 style="
            margin: 0;
            color: #ffffff;
            font-size: 28px;
          ">
            Password Reset
          </h1>
        </div>

        <!-- Content -->
        <div style="padding: 40px 35px;">

          <h2 style="
            margin-top: 0;
            color: #111827;
          ">
            Hello ${name}! 👋
          </h2>

          <p style="
            color: #4b5563;
            font-size: 16px;
            line-height: 1.6;
          ">
            We received a request to reset the password for your account.
            Click the button below to create a new password.
          </p>

          <!-- Button -->
          <div style="
            text-align: center;
            margin: 35px 0;
          ">
            <a
              href="${resetUrl}"
              style="
                display: inline-block;
                padding: 14px 28px;
                background-color: #2563eb;
                color: #ffffff;
                text-decoration: none;
                border-radius: 8px;
                font-size: 16px;
                font-weight: bold;
              "
            >
              Reset Password
            </a>
          </div>

          <p style="
            color: #6b7280;
            font-size: 14px;
            line-height: 1.6;
          ">
            This password reset link will expire in 15 minutes.
            If you did not request a password reset, you can safely
            ignore this email.
          </p>

          <p style="
            color: #6b7280;
            font-size: 13px;
            line-height: 1.6;
            word-break: break-all;
          ">
            If the button doesn't work, copy and paste this URL into your browser:
            <br />
            ${resetUrl}
          </p>

        </div>

        <!-- Footer -->
        <div style="
          background-color: #f9fafb;
          padding: 20px;
          text-align: center;
        ">
          <p style="
            margin: 0;
            color: #9ca3af;
            font-size: 12px;
          ">
            © ${new Date().getFullYear()} Smith Faldu. All rights reserved.
          </p>
        </div>

      </div>
    </body>
    </html>
  `;
};