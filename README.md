<div align="center">

# 📝 Evernote Clone

### *A modern, full-stack note-taking application built with TypeScript*

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Fastify](https://img.shields.io/badge/Fastify-000000?style=for-the-badge&logo=fastify&logoColor=white)](https://www.fastify.io/)
[![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)](https://www.prisma.io/)

*Organize your thoughts, boost your productivity*

[Features](#-features) • [Tech Stack](#-tech-stack) • [Getting Started](#-getting-started) • [API Documentation](#-api-documentation) • [License](#-license)

</div>

---

## ✨ Features

- 🔐 **Secure Authentication** - User registration and login with JWT-based authentication
- 📓 **Notebook Management** - Organize notes into customizable notebooks
- 🏷️ **Smart Tagging** - Tag and categorize notes for quick retrieval
- ✏️ **Rich Text Editor** - Create and edit notes with a powerful editor
- 🔍 **Search & Filter** - Find your notes instantly with advanced search
- 🎨 **Clean UI/UX** - Intuitive and responsive design for all devices
- ⚡ **Fast & Scalable** - Built on modern, performant technologies

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI library with hooks
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool
- **Zustand** - Lightweight state management
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls

### Backend
- **Fastify** - High-performance Node.js framework
- **Prisma ORM** - Type-safe database access
- **TypeScript** - End-to-end type safety
- **JWT** - Secure authentication tokens
- **PostgreSQL/SQLite** - Flexible database support

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- PostgreSQL or SQLite database

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/GitBakko/Evernote.git
   cd Evernote
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env` file in the `backend` directory:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/evernote"
   JWT_SECRET="your-secret-key"
   PORT=3000
   ```

4. **Set up the database**
   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

5. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

### Running the Application

**Backend Server**
```bash
cd backend
npm run dev
```
Server will start on `http://localhost:3000`

**Frontend Application**
```bash
cd frontend
npm run dev
```
Application will open on `http://localhost:5173`

---

## 📚 API Documentation

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |

### Notebooks
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/notebooks` | Get all notebooks |
| POST | `/api/notebooks` | Create notebook |
| PUT | `/api/notebooks/:id` | Update notebook |
| DELETE | `/api/notebooks/:id` | Delete notebook |

### Notes
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/notes` | Get all notes |
| GET | `/api/notes/:id` | Get note by ID |
| POST | `/api/notes` | Create note |
| PUT | `/api/notes/:id` | Update note |
| DELETE | `/api/notes/:id` | Delete note |

### Tags
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tags` | Get all tags |
| POST | `/api/tags` | Create tag |
| DELETE | `/api/tags/:id` | Delete tag |

---

## 📁 Project Structure

```
Evernote/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma      # Database schema
│   └── src/
│       ├── routes/            # API routes
│       ├── services/          # Business logic
│       ├── plugins/           # Fastify plugins
│       └── app.ts             # Main application
│
└── frontend/
    └── src/
        ├── components/        # Reusable components
        ├── features/          # Feature modules
        ├── store/             # State management
        ├── hooks/             # Custom hooks
        └── lib/               # Utilities
```

---

## 🎯 Roadmap

- [ ] Real-time collaboration
- [ ] File attachments support
- [ ] Dark mode theme
- [ ] Export notes to PDF/Markdown
- [ ] Mobile application
- [ ] Advanced search with filters
- [ ] Note sharing capabilities

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/GitBakko/Evernote/issues).

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Made with ❤️ and TypeScript**

⭐ Star this repo if you find it useful!

</div>
