const express = require('express');
const cors = require('cors');
const dbConnect = require('./config/dbConnect');
const mongoose = require('mongoose');
const app = express();
const port = 5000;

dbConnect(); 

app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/auth');
const reviewRoutes = require("./routes/review");
const replyGuideRoutes = require("./routes/replyGuide");
const historyRoutes = require("./routes/history");
const userRoutes = require("./routes/user"); 
const helpRoutes = require('./routes/help');

app.use('/api/auth', authRoutes);
app.use("/api/review", reviewRoutes);
app.use("/api/reply-guide", replyGuideRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/user", userRoutes);
app.use('/api/help', helpRoutes);

app.get('/', (req, res) => {
  res.send('Hello from backend!');
});

app.listen(port, () => {
  console.log(`Backend server running at http://localhost:${port}`);
}); 