const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

const PORT = process.env.PORT || 3000;
const UPLOAD_DIR = path.join(__dirname, 'uploads');
const FILE_TTL_MS = 30 * 60 * 1000; // auto-delete after 30 min

if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

// ── Multer ────────────────────────────────────────────────────────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${uuidv4()}${ext}`);
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp|mp4|webm|mov|pdf|zip|txt|mp3|wav/;
    const ext = path.extname(file.originalname).toLowerCase().slice(1);
    allowed.test(ext) ? cb(null, true) : cb(new Error('File type not allowed'));
  }
});

function scheduleDelete(filePath) {
  setTimeout(() => {
    fs.unlink(filePath, err => {
      if (!err) console.log(`[Auto-Delete] ${path.basename(filePath)}`);
    });
  }, FILE_TTL_MS);
}

// ── Room State ────────────────────────────────────────────────────────────────
const rooms = {};
const USER_COLORS = ['#60d394','#f4a261','#e76f51','#48cae4','#c77dff','#f9c74f','#90e0ef','#ff6b6b','#a8dadc','#ffd166'];

function getRoom(name) {
  if (!rooms[name]) rooms[name] = { users: new Map(), messages: [] };
  return rooms[name];
}

// ── Routes ────────────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(UPLOAD_DIR));

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.get('/api/room/:name', (req, res) => {
  const r = rooms[req.params.name];
  res.json({ users: r ? r.users.size : 0, exists: !!r });
});

app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file' });
  scheduleDelete(path.join(UPLOAD_DIR, req.file.filename));
  res.json({
    filename: req.file.filename,
    originalName: req.file.originalname,
    mimetype: req.file.mimetype,
    size: req.file.size,
    url: `/uploads/${req.file.filename}`
  });
});

// Wildcard room route
app.get('/:roomName([a-zA-Z0-9_-]+)', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'room.html'));
});

// ── Socket.io ─────────────────────────────────────────────────────────────────
io.on('connection', socket => {
  let currentRoom = null;
  let currentUser = null;

  socket.on('join', ({ roomName, userName }) => {
    currentRoom = roomName.toLowerCase().trim();
    const room = getRoom(currentRoom);
    const color = USER_COLORS[room.users.size % USER_COLORS.length];
    currentUser = {
      name: (userName || `Anon${Math.floor(Math.random()*9000+1000)}`).slice(0,20),
      color, id: socket.id
    };
    room.users.set(socket.id, currentUser);
    socket.join(currentRoom);

    socket.emit('self', currentUser);
    socket.emit('history', room.messages.slice(-50));
    io.to(currentRoom).emit('room-update', { count: room.users.size, users: [...room.users.values()] });

    const sys = { type:'system', text:`${currentUser.name} joined`, ts: Date.now() };
    room.messages.push(sys);
    io.to(currentRoom).emit('system', sys);
    console.log(`[+] ${currentUser.name} → #${currentRoom} (${room.users.size} online)`);
  });

  socket.on('message', ({ text }) => {
    if (!currentRoom || !text?.trim()) return;
    const msg = { type:'text', id:uuidv4(), text:text.trim().slice(0,2000), user:currentUser, ts:Date.now() };
    getRoom(currentRoom).messages.push(msg);
    io.to(currentRoom).emit('message', msg);
  });

  socket.on('file-message', fileData => {
    if (!currentRoom) return;
    const msg = { type:'file', id:uuidv4(), file:fileData, user:currentUser, ts:Date.now() };
    getRoom(currentRoom).messages.push(msg);
    io.to(currentRoom).emit('message', msg);
  });

  socket.on('typing', isTyping => {
    if (currentRoom && currentUser)
      socket.to(currentRoom).emit('typing', { user:currentUser, isTyping });
  });

  socket.on('disconnect', () => {
    if (!currentRoom || !currentUser) return;
    const room = rooms[currentRoom];
    if (!room) return;
    room.users.delete(socket.id);
    const sys = { type:'system', text:`${currentUser.name} left`, ts:Date.now() };
    room.messages.push(sys);
    io.to(currentRoom).emit('system', sys);
    io.to(currentRoom).emit('room-update', { count:room.users.size, users:[...room.users.values()] });
    if (room.users.size === 0) delete rooms[currentRoom];
    console.log(`[-] ${currentUser.name} left #${currentRoom}`);
  });
});

server.listen(PORT, () => console.log(`\n🚀  DropChat → http://localhost:${PORT}\n`));
