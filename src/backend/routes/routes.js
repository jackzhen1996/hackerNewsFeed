const express = require('express');
const controllers = require('../controllers/controller.js');

const router = express.Router();

router.get('/getInitialFeeds', controllers.getInitialFeeds);
router.get('/getMoreFeeds', controllers.getMoreFeeds);
router.get('/getComments', controllers.getComments);
router.get('/getBookmarkedData', controllers.getBookmarkedData);
router.get('/getSeenPosts', controllers.getSeenPosts);
router.post('/bookmark', controllers.bookmark);
router.post('/record', controllers.record);

module.exports = router;