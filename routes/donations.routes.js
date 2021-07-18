const express = require('express');
const router = express.Router();

const donationControllers = require('../controllers/donations.controllers');

router.get('/donations', donationControllers.getAll);
router.get('/donations/:id', donationControllers.getDonationById);
router.get('/donations/userid/:userid', donationControllers.getDonationsByUserId);
router.get('/donations/type/:type', donationControllers.getDonationsByType);
router.get('/donations/postcode/:postcode', donationControllers.getDonationsByPostcode);
router.get('/donations/city/:city', donationControllers.getDonationsByCity);
router.post('/donations', donationControllers.create);
router.put('/donations/:id', donationControllers.update);
router.delete('/donations/:id', donationControllers.delete);

module.exports = router;
