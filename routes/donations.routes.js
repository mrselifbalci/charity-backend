const express = require('express');
const router = express.Router();

const donationControllers = require('../controllers/donations.controllers');

router.get('/donations', donationControllers.getAll);

module.exports = router;
