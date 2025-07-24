import catchAsync from '../../utils/catchAsync';
import { httpStatus } from '../../utils/httpStatus';
import sendResponse from '../../utils/sendResponse';
import { authServices } from './auth.service';

// createUser
const createUser = catchAsync(async (req, res) => {
  const result = await authServices.createUserIntoDB(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    message: 'User created successfully',
    data: result,
  });
});

// loginUser
const loginUser = catchAsync(async (req, res) => {
  const { accessToken, refreshToken } = await authServices.loginUserIntoDB(
    req.body
  );

  res.cookie('refreshToken', refreshToken, {
    secure: false,
    httpOnly: true,
  });
  res.cookie('accessToken', accessToken, {
    secure: false,
    httpOnly: true,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Logged in successfully',
    data: {
      accessToken,
      refreshToken,
    },
  });
});

// getMyProfile
const getMyProfile = catchAsync(async (req, res) => {
  const result = await authServices.getMyProfile(req.user);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Profile fetched Successfully',
    data: result,
  });
});

// getNewAccessToken
const getNewAccessToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;
  const result = await authServices.getNewAccessToken(refreshToken);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Access Token Generated successfully',
    data: result,
  });
});

// changePassword
const changePassword = catchAsync(async (req, res) => {
  const user = req.user;
  const result = await authServices.changePasswordIntoDB(user, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Password Changed Successfully',
    data: result,
  });
});

// forgetPassword
const forgetPassword = catchAsync(async (req, res) => {
  const result = await authServices.forgetPassword(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Please, check your email',
    data: result,
  });
});

// resetPassword
const resetPassword = catchAsync(async (req, res) => {
  const token = req.headers.authorization as string;
  const result = await authServices.resetPassword(token, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Password reseated',
    data: result,
  });
});

export const authControllers = {
  createUser,
  loginUser,
  getMyProfile,
  getNewAccessToken,
  changePassword,
  forgetPassword,
  resetPassword,
};
