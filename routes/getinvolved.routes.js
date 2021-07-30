const express = require('express');
const router = express.Router();


const getInvolvedControllers = require('../controllers/getinvolved.controller');

router.get('/getinvolved',getInvolvedControllers.getAll);
router.post('/getinvolved',getInvolvedControllers.create);
router.put('/getinvolved/:id',getInvolvedControllers.updateGetInvolved);
// router.delete('/getinvolved/:id',getInvolvedControllers.deleteSlider);

module.exports = router;
