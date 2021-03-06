const express = require('express');
const router = express.Router();
const { getStoryList, addStory, getUserStory, isImageLiked, updateLikeStory, updateViewStory } = require('../controller/story');
const { verifyToken } = require('../middlewares/tokenVerifier');

router.get('/getStoryList', verifyToken, getStoryList);
router.post('/addStory', verifyToken, addStory);
router.post('/getUserStory', verifyToken, getUserStory);
router.post('/isImageLiked', verifyToken, isImageLiked);
router.post('/updateLikeStory', verifyToken, updateLikeStory);
router.post('/updateViewStory', verifyToken, updateViewStory);
// router.get('/getFollowing', verifyToken, getFollowing);
module.exports = router;