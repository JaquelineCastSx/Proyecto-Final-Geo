const router = require('express').Router();
const svc = require('../services/locationService');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);
router.get('/', async (req, res) => res.json(await svc.getAll()));
router.get('/search', async (req, res) => {
  const { q } = req.query;
  res.json(await svc.getByName(q));
});
router.post('/', async (req, res) => res.json(await svc.create(req.body)));
router.put('/:id', async (req, res) => res.json(await svc.update(req.params.id, req.body)));
router.delete('/:id', async (req, res) => res.json(await svc.remove(req.params.id)));
module.exports = router;
