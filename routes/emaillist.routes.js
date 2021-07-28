const express = require('express');
const router = express.Router();

const emailListControllers = require('../controllers/emaillist.controllers');

router.get('/emaillist', emailListControllers.getAll);

module.exports = router;
