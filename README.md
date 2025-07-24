# 📝 WordPulse

WordPulse is a modern content platform that allows users to create, share, and discover articles. It features AI-powered summarization to provide quick insights and a tag-based system for easy content discovery.

## ✨ Features

- **User Authentication**: Secure user registration and login with JWT-based authentication.
- **Article Management**: Create, edit, and delete articles with a rich text editor.
- **AI-Powered Summarization**: Automatically generate concise summaries of articles using the Cohere AI API.
- **Content Discovery**: Explore articles created by other users and filter them by tags.
- **User Profiles**: View and manage your own articles and profile information.
- **Responsive Design**: A clean and intuitive user interface built with Next.js and Tailwind CSS.
- **Real-time Updates**: Instant UI updates with proper error handling and notifications.

## 🤖 AI Summarization Logic

The application leverages the Cohere AI API to generate summaries of articles. When a user requests a summary, the article's body is sent to the Cohere API, which returns a concise and contextually relevant summary.

---

## 🛠️ Tech Stack

### Frontend

- Next.js 15 with TypeScript
- React 19
- Tailwind CSS for styling
- Shadcn/ui for UI components
- Lucide React for icons
- Zod for validation
- React Hook Form for form management

### Backend

- Node.js with Express
- TypeScript
- Prisma ORM with PostgreSQL
- Cohere AI for summarization
- RESTful API design
- Zod for validation

---

## 📁 Project Structure

```
wordpulse/
├── .gitignore
├── README.md
├── client/
│   ├── .env
│   ├── .gitignore
│   ├── next.config.ts
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       ├── app/
│       ├── components/
│       ├── services/
│       └── types/
└── server/
    ├── .env
    ├── .gitignore
    ├── package.json
    ├── tsconfig.json
    ├── prisma/
    │   └── schema.prisma
    └── src/
        ├── app.ts
        ├── server.ts
        └── app/
            ├── modules/
            │   ├── Auth/
            │   └── article/
            ├── routes/
            └── middlewares/
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- pnpm or npm/yarn
- PostgreSQL database

---

### Installation & Development

1. **Clone the repository**

```bash
git clone <your-repository-url>
cd wordpulse
```

2. **Install backend dependencies**

```bash
cd server
pnpm install
```

3. **Install frontend dependencies**

```bash
cd ../client
pnpm install
```

4. **Set up environment variables**

   - In the `server` directory, create a `.env` file and add the following variables:
     ```
     DATABASE_URL="your-postgresql-database-url"
     JWT_SECRET="your-jwt-secret"
     COHERE_API_KEY="your-cohere-api-key"
     ```
   - In the `client` directory, create a `.env` file and add the following variable:
     ```
     NEXT_PUBLIC_API_URL="http://localhost:5000/api/v1"
     ```

5. **Run database migrations**

```bash
cd ../server
pnpm prisma migrate dev
```

6. **Run backend on development**

```bash
cd ../server
pnpm dev
```

7. **Run frontend on development**

```bash
cd ../client
pnpm dev
```

---

## 🔌 API Endpoints

### Auth

| Method | Endpoint             | Description                |
| ------ | -------------------- | -------------------------- |
| POST   | `/auth/register`     | Register a new user        |
| POST   | `/auth/login`        | Login a user               |
| GET    | `/auth/me`           | Get the current user       |
| POST   | `/auth/new-access-token` | Get a new access token     |
| PATCH  | `/auth/change-password` | Change the user's password |
| POST   | `/auth/forget-password` | Request a password reset   |
| POST   | `/auth/reset-password` | Reset the password         |

### Articles

| Method  | Endpoint               | Description                   |
| ------- | ---------------------- | ----------------------------- |
| POST    | `/articles`            | Create a new article          |
| GET     | `/articles/getOwnArticles` | Get all articles by the user  |
| GET     | `/articles`            | Get all articles              |
| GET     | `/articles/:id`        | Get a single article          |
| PUT     | `/articles/:id`        | Update an article             |
| DELETE  | `/articles/:id`        | Delete an article             |
| POST    | `/articles/:id/summarize` | Summarize an article          |

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.