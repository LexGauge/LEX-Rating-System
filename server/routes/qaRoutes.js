import { Router } from 'express';
import {
  getQuestions,
  getQuestionById,
  getPrivateInquiries,
  createQuestion,
  publishQuestionToPublic,
  requestPublicApproval,
  respondPublicRequest,
  addAnswer,
  upvoteAnswer,
} from '../services/qaService.js';
import { requireAuth } from '../middleware/auth.js';
import { readJSON } from '../lib/db.js';
import { USERS_PATH } from '../config/paths.js';

function getStoredUser(id) {
  return readJSON(USERS_PATH, []).find(u => u.id === id) || null;
}

const router = Router();

router.get('/questions', async (req, res) => {
  try {
    const { category, search, city, includePrivate } = req.query;
    const all = await getQuestions({ category, search, city, includePrivate: includePrivate === 'true' });

    // Pagination
    const page  = Math.max(1, parseInt(req.query.page  || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit || '20', 10)));
    const total = all.length;
    const data  = all.slice((page - 1) * limit, page * limit);

    res.json({ data, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/inquiries', requireAuth, async (req, res) => {
  try {
    const { city, specialization } = req.query;
    res.json(await getPrivateInquiries({
      userId: req.user.id,
      role: req.user.role,
      city,
      specialization,
    }));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/questions/:id', async (req, res) => {
  try {
    const q = await getQuestionById(req.params.id);
    if (!q) return res.status(404).json({ error: 'Question not found' });
    res.json(q);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/questions', requireAuth, async (req, res) => {
  try {
    const me = getStoredUser(req.user.id);
    if (!me) return res.status(401).json({ error: 'User not found' });
    const q = await createQuestion({
      ...req.body,
      authorId: me.id,
      authorName: me.name,
      authorRole: me.role,
    });
    res.status(201).json({ message: 'Question posted successfully', question: q });
  } catch (err) { res.status(400).json({ error: err.message }); }
});

router.post('/questions/:id/request-public', requireAuth, async (req, res) => {
  try {
    const lawyerId = req.user.id;
    const { lawyerName } = req.body;
    const q = await requestPublicApproval(req.params.id, { lawyerId, lawyerName });
    res.json({ message: 'Public request sent to client', question: q });
  } catch (err) { res.status(400).json({ error: err.message }); }
});

router.post('/questions/:id/respond-public-request', requireAuth, async (req, res) => {
  try {
    const { approve } = req.body;
    const q = await respondPublicRequest(req.params.id, req.user.id, Boolean(approve));
    res.json({
      message: approve ? 'Question approved and published to public forum' : 'Public request declined',
      question: q
    });
  } catch (err) { res.status(400).json({ error: err.message }); }
});

router.post('/questions/:id/publish', requireAuth, async (req, res) => {
  try {
    const q = await publishQuestionToPublic(req.params.id, req.user.id);
    res.json({ message: 'Question published to public forum', question: q });
  } catch (err) { res.status(400).json({ error: err.message }); }
});

router.post('/questions/:id/answers', requireAuth, async (req, res) => {
  try {
    const me = getStoredUser(req.user.id);
    if (!me) return res.status(401).json({ error: 'User not found' });
    const answer = await addAnswer(req.params.id, {
      content: req.body.content,
      authorId: me.id,
      authorName: me.name,
      authorUsername: me.username,
      authorRole: me.role,
      isLawyer: me.role === 'lawyer',
      licenseNumber: me.licenseNumber || null,
      specialization: me.specialization || null,
      elo: me.elo ?? null,
      profilePic: me.profilePic || null,
      city: me.city || null,
    });
    res.status(201).json({ message: 'Answer posted successfully', answer });
  } catch (err) { res.status(400).json({ error: err.message }); }
});
router.post('/questions/:id/answers/:answerId/upvote', requireAuth, async (req, res) => {
  try {
    const result = await upvoteAnswer(req.params.id, req.params.answerId, req.user.id);
    res.json(result);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

export default router;
