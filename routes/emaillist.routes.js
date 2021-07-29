const express = require('express');
const router = express.Router();

const emailListControllers = require('../controllers/emaillist.controllers');

router.get('/emaillist', emailListControllers.getAll);
router.post('/emaillist', emailListControllers.create);
router.post('/emaillist/filter', emailListControllers.getWithQuery);

module.exports = router;
