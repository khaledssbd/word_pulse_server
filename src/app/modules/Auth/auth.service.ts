/* eslint-disable @typescript-eslint/no-unused-vars */
import config from '../../config';
import prisma from '../../config/prisma';
import AppError from '../../errors/AppError';
import { httpStatus } from '../../utils/httpStatus';
import bcrypt from 'bcrypt';
import { generateToken, verifyToken } from '../../utils/jwtHelper';
import { JwtPayload, Secret } from 'jsonwebtoken';
import { sendEmail } from '../../utils/sendEmail';
import { User } from '@prisma/client';

// createUserIntoDB
const createUserIntoDB = async (payload: User) => {
  const user = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
  });

  if (user) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Email already used!');
  }

  const hashPassword: string = await bcrypt.hash(
    payload.password,
    Number(config.bcrypt_salt_rounds)
  );

  const userData = {
    ...payload,
    password: hashPassword,
  };

  const result = await prisma.user.create({
    data: userData,
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return result;
};

// loginUserIntoDB
const loginUserIntoDB = async (payload: {
  email: string;
  password: string;
}) => {
  const userData = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
  });

  if (!userData) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Email or password wrong!');
  }

  const isPassswordCorrect: boolean = await bcrypt.compare(
    payload.password,
    userData.password
  );

  if (!isPassswordCorrect) {
    throw new AppError(httpStatus.FORBIDDEN, 'Invalid Credentials');
  }

  const accessToken = generateToken(
    {
      email: userData.email,

      name: userData.name,
    },
    config.jwt.jwt_secret as string,
    config.jwt.jwt_expiration as string
  );

  const refreshToken = generateToken(
    {
      email: userData.email,
      name: userData.name,
    },
    config.jwt.refresh_secret as string,
    config.jwt.jwt_refresh_expiration as string
  );

  return {
    accessToken,
    refreshToken,
  };
};

// getMyProfile
const getMyProfile = async (user: JwtPayload) => {
  const userData = await prisma.user.findFirstOrThrow({
    where: {
      email: user?.email,
    },
    select: {
      id: true,
      name: true,
      email: true,
    },
  });

  return userData;
};

// getNewAccessToken
const getNewAccessToken = async (token: string) => {
  let decodedData;
  try {
    decodedData = verifyToken(token, config.jwt.refresh_secret as Secret);
  } catch (error) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized!');
  }

  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: decodedData.email,
    },
  });

  const accessToken = generateToken(
    {
      email: userData.email,
      name: userData.name,
    },
    config.jwt.jwt_secret as string,
    config.jwt.jwt_expiration as string
  );

  return {
    accessToken,
  };
};

// changePasswordIntoDB
const changePasswordIntoDB = async (
  user: JwtPayload,
  payload: { oldPassword: string; newPassword: string }
) => {
  const userData = await prisma.user.findUnique({
    where: {
      email: user.email,
    },
  });

  if (!userData) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
  }

  const isPassswordCorrect: boolean = await bcrypt.compare(
    payload.oldPassword,
    userData.password
  );

  if (!isPassswordCorrect) {
    throw new AppError(httpStatus.FORBIDDEN, 'Invalid Credentials!');
  }

  const hashedPassword: string = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_rounds)
  );

  const updateData = await prisma.user.update({
    where: {
      email: userData.email,
    },
    data: {
      password: hashedPassword,
      passwordChangedAt: new Date(),
    },
    select: {
      id: true,
      name: true,
      email: true,
    },
  });

  return updateData;
};

// forgetPassword
const forgetPassword = async (payload: { email: string }) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
    },
  });

  const resetPasswordToken = generateToken(
    {
      email: userData.email,
      name: userData.name,
    },
    config.jwt.reset_password_secret!,
    config.jwt.reset_password_expiration!
  );

  const resetPasswordLink =
    config.jwt.reset_password_link +
    `?id=${userData.id}&token=${resetPasswordToken}`;
  const html = `
  <!DOCTYPE html>
  <html>
  <head>
    <style>
      body {
        font-family: 'Arial', sans-serif;
        line-height: 1.6;
        color: #333;
        max-width: 600px;
        margin: 0 auto;
      }
      .header {
        background-color: #2e7d32; /* Changed to green */
        color: white;
        padding: 20px;
        text-align: center;
      }
      .content {
        padding: 20px;
      }
      .reset-button {
        display: inline-block;
        background-color: #2e7d32; /* Changed to green */
        color: white !important;
        padding: 12px 24px;
        text-decoration: none;
        border-radius: 4px;
        font-weight: bold;
        margin: 15px 0;
      }
      .footer {
        background-color: #f4f4f4;
        padding: 15px;
        text-align: center;
        font-size: 12px;
      }
      .warning {
        color: #d9534f;
        font-weight: bold;
      }
    </style>
  </head>
  <body>
    <div class="header">
      <h1>🌳🌴🌲 Password Reset Request</h1>
    </div>

    <div class="content">

      <p>We received a request to reset your ${
        config.app.application_name
      } account password.</p>

      <center>
        <a href="${resetPasswordLink}" class="reset-button">
          Reset Password
        </a>
      </center>

      <p class="warning">⚠️ This link will expire in <strong>10 minutes</strong>.</p>

      <p>If you didn't request this password reset, please:</p>
      <ol>
        <li>Ignore this email</li>
        <li>Secure your account</li>
        <li>Contact our support team if you notice suspicious activity</li>
      </ol>
    </div>

    <div class="footer">
      <p>© ${new Date().getFullYear()} ${
    config.app.application_name
  }. All rights reserved.</p>
      <p>For security reasons, we never ask for your password via email.</p>
    </div>
  </body>
  </html>
`;

  await sendEmail(userData.email, html);
  return null;
};

// resetPassword
const resetPassword = async (
  token: string,
  payload: { id: string; password: string }
) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      id: payload.id,
    },
  });

  const isValidToken = verifyToken(token, config.jwt.reset_password_secret!);

  if (!isValidToken) {
    throw new AppError(httpStatus.FORBIDDEN, 'Forbidden!');
  }

  const hashPassword: string = await bcrypt.hash(
    payload.password,
    Number(config.bcrypt_salt_rounds)
  );

  const result = await prisma.user.update({
    where: {
      id: userData.id,
    },
    data: {
      password: hashPassword,
      passwordChangedAt: new Date(),
    },
    select: {
      id: true,
      name: true,
      email: true,
    },
  });

  return result;
};

export const authServices = {
  createUserIntoDB,
  loginUserIntoDB,
  getMyProfile,
  getNewAccessToken,
  changePasswordIntoDB,
  forgetPassword,
  resetPassword,
};
