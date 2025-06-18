const router = require('express').Router();
const { register, login } = require('../services/userService');
router.post('/register', async (req, res, next) => {
  try { const user = await register(req.body); res.json(user); }
  catch (e) { next(e); }
});
router.post('/login', async (req, res, next) => {
  try { const data = await login(req.body); res.json(data); }
  catch (e) { next(e); }
});
module.exports = router;
