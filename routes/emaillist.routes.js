const express = require('express');
const router = express.Router();

const emailListControllers = require('../controllers/emaillist.controllers');

router.get('/emaillist', emailListControllers.getAll);
router.get('/emaillist/:id', emailListControllers.getEmailListById);
router.post('/emaillist', emailListControllers.create);
router.post('/emaillist/filter', emailListControllers.getWithQuery);
router.update('/emaillist/:id', emailListControllers.update);

module.exports = router;
