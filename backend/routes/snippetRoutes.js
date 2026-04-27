const express = require('express');
const router = express.Router();
const {
    getSnippets,
    getSnippetById,
    createSnippet,
    updateSnippet,
    deleteSnippet
} = require('../controllers/snippetController');
const { protect } = require('../middleware/authMiddleware');

// Public routes (or private depending on rules, let's make read public, write private)
router.route('/').get(getSnippets).post(protect, createSnippet);
router.route('/:id').get(getSnippetById).put(protect, updateSnippet).delete(protect, deleteSnippet);

module.exports = router;
