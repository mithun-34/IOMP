# 💬 DropChat — Ephemeral Real-Time Communication Platform

> **Industrial Oriented Mini Project (IOMP)**
> Academic Year: 2025–2026 | III Year CSE, Section A

---

## 📌 Abstract

DropChat is a novel, ephemeral communication platform that facilitates **real-time, multimedia exchange between users without requiring any account registration or login**. Addressing the need for instantaneous, low-friction file sharing, DropChat utilizes a simple **URL-based room system** — navigating to a unique dynamic path (e.g., `/room-name`) instantly creates or joins a private chat session, mimicking the simplicity of services like [cl1p.net](https://cl1p.net).

The system is built using the **Node.js/Express** backend and a **Socket.io WebSocket** layer to achieve low-latency, bidirectional communication for text messaging. A hybrid approach is employed for multimedia transfer: file uploads (images and videos) are handled via a robust REST API endpoint using the **Multer** library, followed by the broadcast of the secure file path via WebSockets. This ensures network stability while supporting high-quality inline media rendering on the client side.

The architecture prioritizes user **privacy and efficiency**, featuring temporary server-side storage with an optional **auto-destruction mechanism** for all shared media — making DropChat a truly ephemeral communication tool.

---

## 🚀 Features

- 🔗 **No Registration Required** — Join any room instantly via URL
- 💬 **Real-Time Text Messaging** — Powered by Socket.io WebSockets
- 🖼️ **Multimedia Sharing** — Upload and share images and videos inline
- 🔒 **Ephemeral Storage** — Temporary files with optional auto-deletion
- 🏠 **Dynamic Room System** — Each URL path is a unique private room
- ⚡ **Low-Latency Architecture** — Hybrid REST + WebSocket design

---

## 🛠️ Tech Stack

| Layer       | Technology                        |
|-------------|-----------------------------------|
| Backend     | Node.js, Express.js               |
| Real-Time   | Socket.io (WebSockets)            |
| File Upload | Multer (REST API)                 |
| Frontend    | HTML5, CSS3, JavaScript           |
| Storage     | Temporary Server-Side File System |

---

## 📁 Project Structure

```
IOMP/
├── server.js            # Main Express + Socket.io server
├── package.json         # Node.js dependencies
├── public/
│   ├── index.html       # Landing / room entry page
│   ├── chat.html        # Chat room UI
│   ├── style.css        # Styling
│   └── client.js        # Frontend Socket.io logic
├── uploads/             # Temporary media storage
└── README.md
```

---

## ⚙️ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v14+
- npm (comes with Node.js)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/mithun-34/IOMP.git
cd IOMP

# 2. Install dependencies
npm install

# 3. Start the server
node server.js
```

### Usage

1. Open your browser and go to `http://localhost:3000`
2. Navigate to any room by entering a room name: `http://localhost:3000/your-room-name`
3. Share the URL with others to join the same room
4. Send text messages or upload images/videos — no login needed!

---

## 🔄 How It Works

```
User A opens /coolroom  ──►  Server creates room "coolroom"
User B opens /coolroom  ──►  Server joins User B to same room
         │
         ▼
   Text → Socket.io → Broadcast to room
   File → REST (Multer) → Saved → Path broadcast via Socket.io → Rendered inline
```

---

## 🔑 Keywords

`Real-Time Communication` · `WebSockets` · `Node.js` · `Socket.io` · `Multimedia Sharing` · `Ephemeral Messaging` · `Dynamic Routing`

---

## 👨‍💻 Team

| S.No | Roll Number  | Name             |
|------|--------------|------------------|
| 1    | 23B81A0507   | P Balaram        |
| 2    | 23B81A0530   | S Mithun         |
| 3    | 23B81A0541   | P Rajyavardhan   |

---

## 📄 License

This project is developed for academic purposes under the **Industrial Oriented Mini Project** program.

---
