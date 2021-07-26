const express = require('express');
const router = express.Router();

const newsControllers = require('../controllers/news.controllers');

router.get('/news', newsControllers.getAll);
router.get('/news/:id', newsControllers.getSingleNews);
router.post('/news', newsControllers.create);

module.exports = router;
