const express = require('express');
const router = express.Router();

const companyinfoControllers = require('../controllers/companyinfo.controllers');

router.get('/companyinfo', companyinfoControllers.getAll);

module.exports = router;
