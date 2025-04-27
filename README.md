# 🏴‍☠️ One Piece API

![One Piece Banner](https://i.imgur.com/your-banner-image.png)

> "I'm gonna be King of the Pirates!" - Monkey D. Luffy

A powerful RESTful API that brings the world of One Piece to your applications. Dive into the Grand Line and access comprehensive data about your favorite characters, their abilities, bounties, and more!

## 🌟 Features

- **Complete Character Database**
  - Detailed character information
  - Devil Fruit abilities
  - Bounty values
  - Crew affiliations
  - Character images

- **Advanced Search Capabilities**
  - Search by name, crew, or Devil Fruit
  - Filter by bounty range
  - Paginated results
  - Case-insensitive search

- **Image Management**
  - Upload character images
  - Automatic image processing
  - Optimized storage

- **Security**
  - JWT authentication
  - Protected routes
  - Secure password handling
  - Role-based access control

## 🛠️ Tech Stack

| Category | Technologies |
|----------|--------------|
| Backend  | Node.js, TypeScript, Express |
| Database | PostgreSQL, Prisma ORM |
| Security | JWT, Bcrypt |
| Storage  | Multer, Sharp |
| DevOps   | Docker, Docker Compose |

## 📚 API Documentation

### Characters Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/characters` | List all characters |
| GET    | `/characters/search?q=query` | Search characters |
| GET    | `/characters/:id` | Get character by ID |
| POST   | `/characters` | Create new character |
| PUT    | `/characters/:id` | Update character |
| DELETE | `/characters/:id` | Delete character |

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST   | `/auth/register` | Register new user |
| POST   | `/auth/login` | User login |
| GET    | `/auth/me` | Get current user |

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- PostgreSQL
- Docker (optional)

### Installation

1. Clone the repository

```bash
git clone https://github.com/yourusername/one-piece-api.git
cd one-piece-api
```

2. Install dependencies

```bash
npm install
```

3. Configure environment variables

```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Set up the database

```bash
npx prisma migrate dev
```

5. Start the development server

```bash
npm run dev
```

### Using Docker

```bash
docker-compose up -d
```

## 📝 Example Usage

### Search for Characters

```bash
curl "http://localhost:9000/characters/search?q=luffy"
```

Response:

```json
{
    "status": "success",
    "data": {
        "characters": [
            {
                "id": "1",
                "name": "Monkey D. Luffy",
                "description": "Captain of the Straw Hat Pirates",
                "bounty": 3000000000,
                "devilFruit": "Gomu Gomu no Mi",
                "crew": "Straw Hat Pirates"
            }
        ],
        "pagination": {
            "total": 1,
            "page": 1,
            "limit": 10,
            "totalPages": 1
        }
    }
}
```

## 🤝 Contributing

We welcome contributions! Please read our [Contributing Guidelines](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Eiichiro Oda for creating One Piece
- The One Piece community for their support
- All contributors to this project

---

Made with ❤️ by [Fábio Almeida]

[![GitHub stars](https://img.shields.io/github/stars/AlmeidaFabio/one-piece-api?style=social)](https://github.com/AlmeidaFabio/one-piece-api)
