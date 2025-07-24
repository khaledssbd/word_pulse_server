import { NextFunction, Request, Response, Router } from 'express';
import { articleControllers } from './article.controller';
import { auth } from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { articleValidationSchemas } from './article.validation';

const router: Router = Router();

// createAnArticle
router.post(
  '/',
  auth(),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(articleValidationSchemas.createAnArticle),
  articleControllers.createAnArticle
);

// getOwnAllArticles
router.get('/getOwnArticles', auth(), articleControllers.getOwnAllArticles);

// getAllArticles
router.get('/', articleControllers.getAllArticles);

// getSingleArticle
router.get('/:id', articleControllers.getSingleArticle);

// updateAnArticle
router.put(
  '/:id',
  auth(),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(articleValidationSchemas.createAnArticle),
  articleControllers.updateAnArticle
);

// deleteAnArticle
router.delete('/:id', articleControllers.deleteAnArticle);

// summarizeArticle
router.delete(
  '/summarize-article/:id',
  auth(),
  articleControllers.summarizeArticle
);

export const ArticleRoutes = router;
