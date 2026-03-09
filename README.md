# 💬 DropChat

A real-time, ephemeral multimedia chat platform — **no login, no registration**, just share a URL.

## ✨ Features

- **URL-based rooms** — go to `/any-room-name` to instantly create/join a room
- **Real-time messaging** via WebSockets (Socket.io)
- **File & media sharing** — images render inline, videos play in-browser
- **Auto-delete** — uploaded files are deleted from the server after 30 minutes
- **Typing indicators** — see when others are typing
- **Message history** — last 50 messages shown on join
- **Drag & drop** file uploads
- **No account needed** — completely anonymous

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Node.js + Express |
| Real-time | Socket.io (WebSockets) |
| File Upload | Multer (REST API) |
| Frontend | Vanilla HTML/CSS/JS |

## 🚀 Setup & Run

### Prerequisites
- Node.js v16+ installed

### Steps

```bash
# 1. Navigate into the project folder
cd dropchat

# 2. Install dependencies
npm install

# 3. Start the server
npm start
# OR for auto-restart on file changes:
npm run dev
```

Then open your browser at: **http://localhost:3000**

## 📁 Project Structure

```
dropchat/
├── server.js          # Express + Socket.io backend
├── package.json
├── uploads/           # Temporary file storage (auto-created)
└── public/
    ├── index.html     # Landing page (enter room name)
    └── room.html      # Chat room interface
```

## 🔧 Configuration

Edit `server.js` to change:
- `PORT` — default is `3000`
- `FILE_TTL_MS` — auto-delete timer, default is `30 * 60 * 1000` (30 min)
- Max file size — default is `50MB`

## 📡 API Reference

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/` | Landing page |
| GET | `/:roomName` | Join/create a room |
| POST | `/upload` | Upload a file (multipart/form-data) |
| GET | `/api/room/:name` | Get room info (user count) |
| GET | `/uploads/:filename` | Serve uploaded files |

## 🔌 Socket Events

| Event | Direction | Payload |
|-------|-----------|---------|
| `join` | Client→Server | `{ roomName, userName }` |
| `message` | Client→Server | `{ text }` |
| `file-message` | Client→Server | file metadata from `/upload` |
| `typing` | Client→Server | `boolean` |
| `self` | Server→Client | user object |
| `history` | Server→Client | array of messages |
| `message` | Server→Client | message object |
| `system` | Server→Client | system message |
| `room-update` | Server→Client | `{ count, users }` |
| `typing` | Server→Client | `{ user, isTyping }` |

## 👨‍💻 Team

| Roll No | Name |
|---------|------|
| 23B81A0507 | P Balaram |
| 23B81A0530 | S Mithun |
| 23B81A0541 | P Rajyavardhan |

**CVR College of Engineering — III Year CSE (2025-2026)**
