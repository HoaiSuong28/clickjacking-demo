'use strict';
const express = require('express');
const router = express.Router();

// Import controller
const { 
    getAllBlogs, 
    getBlogById 
} = require('../../controllers/blog.controller');

// Import bot detection
const { detectBot } = require('../../middleware/botDetection');

// Định nghĩa các routes (có bot detection)
// GET /api/blogs -> Lấy danh sách blog
router.get('/', detectBot, getAllBlogs);

// GET /api/blogs/:id -> Lấy chi tiết một blog
router.get('/:id', detectBot, getBlogById);

module.exports = router;