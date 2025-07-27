const express = require('express');
const ReplyGuide = require('../models/ReplyGuide');
const router = express.Router();
const { auth } = require('./user');

// 전체 템플릿 목록
router.get('/', auth, async (req, res) => {
  try {
    const guides = await ReplyGuide.find({ isMetadata: { $ne: true } });
    res.json(guides);
  } catch (error) {
    res.status(500).json({ error: '템플릿 조회 실패' });
  }
});

// 단건 조회
router.get('/:id', auth, async (req, res) => {
  try {
    const guide = await ReplyGuide.findById(req.params.id);
    if (!guide) return res.status(404).json({ message: 'Not found' });
    res.json(guide);
  } catch (error) {
    res.status(500).json({ error: '템플릿 조회 실패' });
  }
});

// 관리자: 새 템플릿 추가
router.post('/', auth, async (req, res) => {
  try {
    const { category, title, situation, content } = req.body;
    
    // 필수 필드 검증
    if (!category || !title || !content) {
      return res.status(400).json({ error: '필수 필드가 누락되었습니다.' });
    }
    
    const newGuide = new ReplyGuide({
      category,
      title,
      situation,
      content
    });
    
    await newGuide.save();
    res.status(201).json(newGuide);
  } catch (error) {
    res.status(500).json({ error: '템플릿 추가 실패' });
  }
});

// 관리자: 템플릿 수정
router.put('/:id', auth, async (req, res) => {
  try {
    const { category, title, situation, content } = req.body;
    
    const updatedGuide = await ReplyGuide.findByIdAndUpdate(
      req.params.id,
      { category, title, situation, content },
      { new: true, runValidators: true }
    );
    
    if (!updatedGuide) {
      return res.status(404).json({ error: '템플릿을 찾을 수 없습니다.' });
    }
    
    res.json(updatedGuide);
  } catch (error) {
    res.status(500).json({ error: '템플릿 수정 실패' });
  }
});

// 관리자: 템플릿 삭제
router.delete('/:id', auth, async (req, res) => {
  try {
    const deletedGuide = await ReplyGuide.findByIdAndDelete(req.params.id);
    
    if (!deletedGuide) {
      return res.status(404).json({ error: '템플릿을 찾을 수 없습니다.' });
    }
    
    res.json({ message: '템플릿이 삭제되었습니다.' });
  } catch (error) {
    res.status(500).json({ error: '템플릿 삭제 실패' });
  }
});

// 관리자: 버전 정보 조회
router.get('/admin/version', auth, async (req, res) => {
  try {
    const versionDoc = await ReplyGuide.findOne({ isMetadata: true });
    res.json({
      version: versionDoc?.templateVersion || 'unknown',
      lastUpdated: versionDoc?.lastUpdated || null,
      totalTemplates: await ReplyGuide.countDocuments({ isMetadata: { $ne: true } })
    });
  } catch (error) {
    res.status(500).json({ error: '버전 정보 조회 실패' });
  }
});

module.exports = router;