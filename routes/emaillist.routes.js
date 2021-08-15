const express = require('express');
const router = express.Router();

const emailListControllers = require('../controllers/emaillist.controllers');

router.get('/emaillist', emailListControllers.getAll);
router.get('/emaillist/:id', emailListControllers.getEmailListById);
router.get('/emaillist/email/:email', emailListControllers.getEmailListById);
router.post('/emaillist', emailListControllers.create);
router.put('/emaillist/:id', emailListControllers.updateList);
router.delete('/emaillist/:id', emailListControllers.removeList);

module.exports = router;
