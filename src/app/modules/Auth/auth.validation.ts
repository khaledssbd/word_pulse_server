import { z } from 'zod';

// createUserSchema
const createUserSchema = z.object({
  body: z.object({
    name: z
      .string({
        required_error: 'Name is required!',
        invalid_type_error: 'Name must be a string!',
      })
      .trim()
      .nonempty({ message: 'Name is Required!' })
      .min(3, 'Name must be between 3 and 30 characters!')
      .max(30, 'Name must be between 3 and 30 characters!'),

    email: z
      .string({
        required_error: 'Email is required!',
        invalid_type_error: 'Email must be a string!',
      })
      .email('Invalid email address!')
      .trim()
      .nonempty({ message: 'Email is Required!' }),

    password: z
      .string({
        required_error: 'Password is required!',
        invalid_type_error: 'Password must be a string!',
      })
      .trim()
      .nonempty({ message: 'Password is Required!' })
      .min(8, 'Password must be between 8 and 30 characters!')
      .max(20, 'Password must be between 8 and 30 characters!'),
  }),
});

// loginUserSchema
const loginUserSchema = z.object({
  body: z.object({
    email: z
      .string({
        required_error: 'Email is required!',
        invalid_type_error: 'Email must be a string!',
      })
      .email('Invalid email address!')
      .trim()
      .nonempty({ message: 'Email is Required!' }),

    password: z
      .string({
        required_error: 'Password is required!',
        invalid_type_error: 'Password must be a string!',
      })
      .trim()
      .nonempty({ message: 'Password is Required!' })
      .min(8, 'Password must be between 8 and 30 characters!')
      .max(20, 'Password must be between 8 and 30 characters!'),
  }),
});

export const authValidation = {
  createUserSchema,
  loginUserSchema,
};
