const express = require('express');
const router = express.Router();

const mediasControllers = require('../controllers/medias.controllers');

const { getSingleCache, getCache } = require('../config/redis.config')

router.get('/medias', getCache, mediasControllers.getAllMedia);
router.get('/medias/:mediaId', getSingleCache, mediasControllers.getSingleMedia);
router.post('/medias', mediasControllers.createMedia);
router.put('/medias/:mediaId', mediasControllers.updateSingleMedia);
router.delete('/medias/:mediaId', mediasControllers.removeSingleMedia);

module.exports = router;
