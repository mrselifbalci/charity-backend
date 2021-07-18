const express = require('express');
const router = express.Router();

const donationControllers = require('../controllers/donations.controllers');

router.get('/donations', donationControllers.getAll);
router.get('/donations/:id', donationControllers.getDonationById);
router.post('/donations', donationControllers.create);

module.exports = router;
