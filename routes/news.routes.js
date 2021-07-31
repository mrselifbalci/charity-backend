const express = require('express');
const router = express.Router();

const newsControllers = require('../controllers/news.controllers');

router.get('/news', newsControllers.getAll);
router.get('/news/:id', newsControllers.getSingleNews);
router.get('/news/type/:type', newsControllers.getNewsByType);
router.post('/news', newsControllers.create);
router.put('/news/:id', newsControllers.updateNews);
router.delete('/news/:id', newsControllers.removeNews);

module.exports = router;
