const express = require('express');
const router = express.Router();

const companyinfoControllers = require('../controllers/companyinfo.controllers');

router.get('/companyinfo', companyinfoControllers.getAll);
router.post('/companyinfo', companyinfoControllers.create);

module.exports = router;
