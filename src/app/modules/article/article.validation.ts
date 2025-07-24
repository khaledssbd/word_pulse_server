import { z } from 'zod';

// createAnArticle
const createAnArticle = z.object({
  body: z.object({
    title: z
      .string({
        required_error: 'Title is required!',
        invalid_type_error: 'Title must be string!',
      })
      .trim()
      .min(10, { message: 'Title must have minimum 10 characters!' })
      .max(100, { message: "Title can't exceed 100 characters!" }),

    body: z
      .string({
        required_error: 'Body is required!',
        invalid_type_error: 'Body must be string!',
      })
      .trim()
      .min(100, { message: 'Body must have minimum 100 characters!' }),

    tags: z.array(z.string()).min(1, { message: 'Tags are required!' }),
  }),
});

export const articleValidationSchemas = {
  createAnArticle,
};
