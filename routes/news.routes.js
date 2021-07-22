const express = require('express');
const router = express.Router();

const newsControllers = require('../controllers/news.controllers');

router.get('/news', newsControllers.getAll);

module.exports = router;
