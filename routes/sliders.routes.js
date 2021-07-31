const express = require('express');
const router = express.Router();


const slidersControllers = require('../controllers/sliders.controller');

router.get('/slider',slidersControllers.getAll);
router.post('/slider',slidersControllers.create);
router.put('/slider/:id',slidersControllers.updateSlider);
router.delete('/slider/:id',slidersControllers.deleteSlider);

module.exports = router;
