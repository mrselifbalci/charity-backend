const express = require('express');
const router = express.Router();

const getInvolvedControllers = require('../controllers/getinvolved.controller');

router.get('/getinvolved', getInvolvedControllers.getAll);
router.get('/getinvolved/:id', getInvolvedControllers.getSingleInvolve);
router.get('/getinvolved/title/:title', getInvolvedControllers.getByTitle);
router.post('/getinvolved', getInvolvedControllers.create);
router.put('/getinvolved/:id', getInvolvedControllers.updateGetInvolved);
router.delete('/getinvolved/:id', getInvolvedControllers.deleteGetInvolved);

module.exports = router;
