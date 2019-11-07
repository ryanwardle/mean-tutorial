const express = require('express');
const router = express.Router();

const checkAuth = require('../middleware/check-auth');
const extractFile = require('../middleware/file');

const PostsController = require('../controllers/posts');


// '' is the path, checkAuth is the checkAuth middleware and multer is image upload middleware
router.post('',
            checkAuth,
            extractFile,
            PostsController.createPost);

// '/:id' is the path, checkAuth is the checkAuth middleware and multer is image upload middleware
router.put('/:id',
          checkAuth,
          extractFile,
          PostsController.updatePost);

router.get('', PostsController.getPosts);

router.get('/:id', PostsController.getPost);

// '/:id' is the path and checkAuth is the checkAuth middleware
router.delete('/:id', checkAuth, PostsController.deletePost)

module.exports = router;
