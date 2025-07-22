// backend/routes/history.js
const express = require("express");
const router = express.Router();
const History = require("../models/History");

router.post("/", async (req, res) => {
  try {
    const { userId, emails, contextLabel } = req.body;

    const history = new History({
      userId,
      emails,
      contextLabel
    });

    const saved = await history.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("History 저장 실패:", err.message);
    res.status(500).json({ error: "DB 저장 중 오류" });
  }
});

router.get('/', async (req, res) => {
  try {
    const { userId, keyword, status, recent, date } = req.query;
    const filter = {};

    if (userId) filter.userId = userId;
    if (status && status !== '전체') filter.status = status;
    if (recent === 'true') {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      filter.createdAt = { $gte: sevenDaysAgo };
    }
    if (date) {
      const d = new Date(date);
      const next = new Date(d);
      next.setDate(d.getDate() + 1);
      filter.sentAt = { $gte: d, $lt: next };
    }
    if (keyword) {
      filter.$or = [
        { title: { $regex: keyword, $options: 'i' } },
        { content: { $regex: keyword, $options: 'i' } },
        { recipient: { $regex: keyword, $options: 'i' } }
      ];
    }

    const histories = await History.find(filter).sort({ sentAt: -1 });
    res.json(histories);
  } catch (err) {
    res.status(500).json({ error: '히스토리 불러오기 실패' });
  }
});

module.exports = router;