const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, { 
  dbName: 'finlit_bot',
  retryWrites: true,
  w: 'majority'
})
.then(() => console.log('✅ MongoDB Atlas connected!'))
.catch(err => console.error('MongoDB error:', err));

const chatSchema = new mongoose.Schema({
  sessionId: String,
  messages: [{ role: String, content: String, timestamp: { type: Date, default: Date.now } }]
});
const Chat = mongoose.model('Chat', chatSchema);

app.get('/api/chats', async (req, res) => {
  const chats = await Chat.find();
  res.json(chats);
});

app.post('/api/chat', async (req, res) => {
  const { sessionId, message } = req.body;
  const aiResponse = await fetch(`${process.env.AI_SERVICE_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message })
  }).then(r => r.json());

  let chat = await Chat.findOne({ sessionId });
  if (!chat) chat = new Chat({ sessionId, messages: [] });
  
  chat.messages.push({ role: 'user', content: message });
  chat.messages.push({ role: 'assistant', content: aiResponse.response });
  await chat.save();
  
  res.json(aiResponse);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Backend on port ${PORT}`));
// ... your entire server.js code above ...

// Vercel serverless export (ADD THESE 3 LINES)
const handler = app;
module.exports = handler;  // REQUIRED for Vercel
