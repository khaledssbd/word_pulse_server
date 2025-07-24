import { authControllers } from './auth.controller';
import { auth } from '../../middlewares/auth';
import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { authValidation } from './auth.validation';

const router = Router();

// createUser
router.post(
  '/register',
  validateRequest(authValidation.createUserSchema),
  authControllers.createUser
);

// loginUser
router.post(
  '/login',
  validateRequest(authValidation.loginUserSchema),
  authControllers.loginUser
);

// getMyProfile
router.get('/me', auth(), authControllers.getMyProfile);

// getAccessToken
router.post('/new-access-token', authControllers.getNewAccessToken);

// changePassword
router.patch('/change-password', auth(), authControllers.changePassword);

// forgetPassword
router.post('/forget-password', authControllers.forgetPassword);

// resetPassword
router.post('/reset-password', authControllers.resetPassword);

export const AuthRoutes = router;
