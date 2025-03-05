const nodemailer = require('nodemailer');
const { google } = require('googleapis');

require('dotenv').config();

const clientId = process.env.EMAIL_CLIENT_ID;
const clientSecret = process.env.EMAIL_CLIENT_SECRET;
const redirectUri = process.env.EMAIL_REDIRECT_URI;
const refreshToken = process.env.EMAIL_REFRESH_TOKEN;

const emailAddress = process.env.SERVER_EMAIL_ADDRESS;
const siteUrl = process.env.SITE_URL;

const oauthClient = new google.auth.OAuth2(clientId, clientSecret, redirectUri);
oauthClient.setCredentials({ refresh_token: refreshToken });

async function sendEmail(clientEmailAdd, subject, text, html) {
  try {
    const accessToken = await oauthClient.getAccessToken();
    const transport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAUTH2',
        user: emailAddress,
        clientId,
        clientSecret,
        refreshToken,
        accessToken,
      },
    });

    const mailOptions = {
      from: `CoBlog Team <${emailAddress}>`,
      to: clientEmailAdd,
      subject,
      text,
      html,
    };

    return await transport.sendMail(mailOptions);
  } catch (err) {
    console.log(`An Email error occured: ${err}`);
    throw (err);
  }
}

export async function sendAuthenticationOTP(user, OTP, OTPTimeOut) {
  if (!user.username || !user.email) {
    return false;
  }

  const subject = 'Welcome to Coblog! Your OTP to Authenticate Your Gmail Account';
  const plainText = `Dear ${user.username},
Welcome to Coblog! We're thrilled to have you join our community and begin collaborating on your blog in real time.

To complete your registration and authenticate your Gmail account, please use the OTP below:

Your OTP: ${OTP}

Enter this OTP on the authentication page to confirm your account and get started with all the features Coblog has to offer.

Note: This OTP is valid for ${OTPTimeOut} Minutes. If it expires, simply request a new one.

If you didn’t request this verification or believe this message was sent to you by mistake, feel free to disregard it.

If you have any questions or need assistance, please reach out to our support team at ${emailAddress}.

Thank you for choosing Coblog, and happy blogging!

Best regards,
The Coblog Team
${siteUrl}
${emailAddress}
${siteUrl}`;

  const htmlText = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Coblog - OTP Authentication</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
            }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }
        .header {
            background-color: #0056b3;
            color: #ffffff;
            padding: 10px;
            text-align: center;
            border-radius: 8px 8px 0 0;
        }
        .content {
            margin: 20px 0;
        }
        .otp-code {
            font-size: 24px;
            font-weight: bold;
            color: #0056b3;
        }
        .footer {
            text-align: center;
            margin-top: 20px;
            font-size: 12px;
            color: #777;
        }
        .button {
            display: inline-block;
            background-color: #0056b3;
            color: #ffffff;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 4px;
            text-align: center;
        }
    </style>
</head>
<body>

    <div class="container">
        <div class="header">
            <h2>Welcome to Coblog!</h2>
        </div>
        <div class="content">
            <p>Dear ${user.username},</p>
            <p>Welcome to Coblog! We're thrilled to have you join our community and begin collaborating on your blog in real time.</p>
            <p>To complete your registration and authenticate your Gmail account, please use the OTP below:</p>
            <p class="otp-code">${OTP}</p>
            <p>Enter this OTP on the authentication page to confirm your account and get started with all the features Coblog has to offer.</p>
            <p><strong>Note:</strong> This OTP is valid for ${OTPTimeOut} minutes. If it expires, simply request a new one</p>
            <p>If you didn’t request this verification or believe this message was sent to you by mistake, feel free to disregard it.</p>
            <p>If you have any questions or need assistance, please reach out to our support team at <a href="mailto:${emailAddress}">Coblog Support</a>.</p>
        </div>

        <div class="footer">
            <p>Thank you for choosing Coblog, and happy blogging!</p>
            <p>Best regards,<br>The Coblog Team</p>
            <p><a href="${siteUrl}" class="button">Visit Coblog</a></p>
            <p>${emailAddress} | ${siteUrl}</p>
        </div>
    </div>

</body>
</html>`;

  try {
    const result = await sendEmail(user.email, subject, plainText, htmlText);
    console.log(result)
  } catch (err) {
    console.log(err);
    return false
  }

  return true;
}

export async function  sendVerificationOTP(user, OTP, OTPTimeOut) {
    if (!user.username || !user.email) {
        return false;
    }

    const subject = `Reset Your Coblog Password`;
    const plainText = `Dear ${user.username},

We received a request to reset your password for your Coblog account.

To reset your password, please use the OTP below:

Your OTP: ${OTP}

Enter this OTP on the password reset page to proceed with changing your password.

Note: This OTP is valid for ${OTPTimeOut} minutes. If it expires, you can request a new OTP on the reset page.

If you didn’t request a password reset, please disregard this message. Your account is safe.

If you need any help, feel free to contact our support team at ${emailAddress}.

Thank you for using Coblog!

Best regards,
The Coblog Team
${siteUrl}
${emailAddress}
${siteUrl}`;

    const htmlText = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your Coblog Password - OTP Authentication</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }
        .header {
            background-color: #0056b3;
            color: #ffffff;
            padding: 10px;
            text-align: center;
            border-radius: 8px 8px 0 0;
        }
        .content {
            margin: 20px 0;
        }
        .otp-code {
            font-size: 24px;
            font-weight: bold;
            color: #0056b3;
        }
        .footer {
            text-align: center;
            margin-top: 20px;
            font-size: 12px;
            color: #777;
        }
        .button {
            display: inline-block;
            background-color: #0056b3;
            color: #ffffff;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 4px;
            text-align: center;
        }
    </style>
</head>
<body>

    <div class="container">
            <div class="header">
                <h2>Password Reset Request for Coblog</h2>
            </div>
            <div class="content">
                <p>Dear ${user.username},</p>
                <p>We received a request to reset your password for your Coblog account.</p>
                <p>To reset your password, please use the OTP below:</p>
                <p class="otp-code">${OTP}</p>
                <p>Enter this OTP on the password reset page to proceed with changing your password.</p>
                <p><strong>Note:</strong> This OTP is valid for ${OTPTimeOut} minutes. If it expires, you can request a new OTP on the reset page.</p>
                <p>If you didn’t request a password reset, please disregard this message. Your account is safe.</p>
                <p>If you need any help, feel free to contact our support team at <a href="mailto:coblogteam@gmail.com">Coblog</a>.</p>
            </div>

    <div class="footer">
                <p>Thank you for using Coblog!</p>
                <p>Best regards,<br>The Coblog Team</p>
                <p><a href="https://coblog.semx.tech" class="button">Go to Coblog</a></p>
                <p>coblogteam@gmail.com | https://coblog.semx.tech</p>
            </div>
        </div>

    </body>
</html>`;

    try {
        const result = await sendEmail(user.email, subject, plainText, htmlText);
        console.log(result);
    } catch(err) {
        console.log(err);
        return false
    }
    return true;
}
