var express = require('express');
var router = express.Router();

const commentsControllers = require('../controllers/comments.controllers');

router.get('/comments', commentsControllers.getAll);
router.get('/comments/:id', commentsControllers.getSingleComment);
router.get('/comments/user/:userid', commentsControllers.getCommentsByUserId);
router.get('/comments/list/:listid', commentsControllers.getCommentsByList);
router.post('/comments', commentsControllers.create);
router.put('/comments/:id', commentsControllers.updateComment);
router.delete('/comments/:id', commentsControllers.removeSingleComment);

module.exports = router;
 