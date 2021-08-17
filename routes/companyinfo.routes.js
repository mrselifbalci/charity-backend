const express = require('express');
const router = express.Router();

const companyinfoControllers = require('../controllers/companyinfo.controllers');

router.get('/companyinfo', companyinfoControllers.getAll);
router.get('/companyinfo/:id', companyinfoControllers.getById);
router.post('/companyinfo', companyinfoControllers.create);
router.put('/companyinfo/:id', companyinfoControllers.update);
router.delete('/companyinfo/:id', companyinfoControllers.delete);

module.exports = router;
