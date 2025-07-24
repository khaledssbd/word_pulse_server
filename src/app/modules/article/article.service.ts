import { Article } from '@prisma/client';
import prisma from '../../config/prisma';
import { articleFilters } from './article.utilities';
import { JwtPayload } from 'jsonwebtoken';
import { TPaginationReturn } from '../../builder/paginationHelper';
import { TArticleFilterOptions } from './article.constants';
import { httpStatus } from '../../utils/httpStatus';
import AppError from '../../errors/AppError';
import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';

const createAnArticleIntoDB = async (
  userData: JwtPayload,
  payload: Article
) => {
  payload.authorId = userData.id;

  const result = await prisma.article.create({
    data: payload,
  });

  return result;
};

// getAllArticlesFromDB
const getAllArticlesFromDB = async (
  pagiOptions: TPaginationReturn,
  filters?: TArticleFilterOptions
) => {
  // pagiOptions
  const { limit, page, skip, sortBy, sortOrder } = pagiOptions;

  // filterOptions
  const filterOptions = articleFilters(filters);

  const result = await prisma.article.findMany({
    where: { ...filterOptions },
    skip,
    take: limit,
    orderBy: { [sortBy]: sortOrder },
    include: {
      author: true,
    },
  });

  const count = await prisma.article.count({
    where: { ...filterOptions },
  });

  return {
    meta: {
      page: page,
      limit: limit,
      total: count,
      totalPage: Math.ceil(count / limit),
    },
    data: result,
  };
};

// get own Articles from DB
const getOwnAllArticlesFromDB = async (
  pagiOptions: TPaginationReturn,
  user: JwtPayload,
  filters?: TArticleFilterOptions
) => {
  // pagiOptions
  const { limit, page, skip, sortBy, sortOrder } = pagiOptions;

  // filterOptions
  const filterOptions = articleFilters(filters);

  const whereOptions = { authorId: user?.id, ...filterOptions };

  const result = await prisma.article.findMany({
    where: whereOptions,
    skip,
    take: limit,
    orderBy: { [sortBy]: sortOrder },
    include: {
      author: true,
    },
  });

  const count = await prisma.article.count({ where: whereOptions });

  return {
    meta: {
      page: page,
      limit: limit,
      total: count,
      totalPage: Math.ceil(count / limit),
    },
    data: result,
  };
};

// getSingleArticleFromDB
const getSingleArticleFromDB = async (id: string): Promise<Article | null> => {
  const article = await prisma.article.findUnique({
    where: { id },
    include: {
      author: true,
    },
  });

  return article;
};

// updateArticleFromDB
const updateArticleFromDB = async (
  id: string,
  payload: Partial<Article>
): Promise<Article | null> => {
  const result = await prisma.article.update({
    where: {
      id,
    },
    data: payload,
  });

  return result;
};

// deleteAnArticleFromDB
const deleteAnArticleFromDB = async (id: string) => {
  const result = await prisma.article.delete({
    where: { id },
  });

  return result;
};

// summarizeArticleFromDB
const summarizeArticleFromDB = async (id: string, user: JwtPayload) => {
  const article = await prisma.article.findUnique({
    where: { id },
  });

  if (!article) {
    throw new AppError(httpStatus.NOT_FOUND, 'Article not found!');
  }

  if (article.authorId !== user.id) {
    throw new AppError(httpStatus.FORBIDDEN, 'Forbidden!');
  }

  // Check if we have OpenAI API key, otherwise return mock summary
  if (!process.env.OPENAI_API_KEY) {
    const mockSummary = `This is a mock summary of "${article.title}". The article discusses various topics and provides insights into the subject matter. Key points include important concepts and practical applications that readers can benefit from.`;

    return { summary: mockSummary };
  }

  const { text: summary } = await generateText({
    model: openai('gpt-4o-mini'),
    system:
      'You are a professional summarizer. Provide concise, informative summaries that capture the key points and main ideas of the given text.',
    prompt: `Please summarize the following article titled "${article.title}":\n\n${article.body}`,
    maxTokens: 200,
  });

  return { summary };
};

export const articleServices = {
  createAnArticleIntoDB,
  getAllArticlesFromDB,
  getOwnAllArticlesFromDB,
  getSingleArticleFromDB,
  updateArticleFromDB,
  deleteAnArticleFromDB,
  summarizeArticleFromDB,
};
