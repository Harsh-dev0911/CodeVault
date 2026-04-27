const Snippet = require('../models/Snippet');

// Get all snippets
const getSnippets = async (req, res) => {
    try {
        const query = {};
        
        // Basic searching and filtering
        if (req.query.search) {
            query.title = { $regex: req.query.search, $options: 'i' };
        }
        if (req.query.language) {
            query.language = req.query.language;
        }

        const snippets = await Snippet.find(query).populate('user', 'username email').sort({ createdAt: -1 });
        res.json(snippets);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// Get single snippet
const getSnippetById = async (req, res) => {
    try {
        const snippet = await Snippet.findById(req.params.id).populate('user', 'username email');
        if (snippet) {
            res.json(snippet);
        } else {
            res.status(404).json({ message: 'Snippet not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// Create a snippet
const createSnippet = async (req, res) => {
    try {
        const { title, code, language, tags } = req.body;
        
        const snippet = await Snippet.create({
            title,
            code,
            language,
            tags: tags || [],
            user: req.user
        });

        res.status(201).json(snippet);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// Update snippet
const updateSnippet = async (req, res) => {
    try {
        const snippet = await Snippet.findById(req.params.id);

        if (!snippet) {
            return res.status(404).json({ message: 'Snippet not found' });
        }

        if (snippet.user.toString() !== req.user) {
            return res.status(401).json({ message: 'Not authorized to edit this snippet' });
        }

        const updatedSnippet = await Snippet.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.json(updatedSnippet);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// Delete snippet
const deleteSnippet = async (req, res) => {
    try {
        const snippet = await Snippet.findById(req.params.id);

        if (!snippet) {
            return res.status(404).json({ message: 'Snippet not found' });
        }

        if (snippet.user.toString() !== req.user) {
            return res.status(401).json({ message: 'Not authorized to delete this snippet' });
        }

        await Snippet.findByIdAndDelete(req.params.id);
        res.json({ message: 'Snippet removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getSnippets,
    getSnippetById,
    createSnippet,
    updateSnippet,
    deleteSnippet
};
