const express = require('express');
const Url = require('../models/Url');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Generate a random short code
const generateShortCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// GET /api/r/:shortCode — Public redirect (no auth required)
router.get('/r/:shortCode', async (req, res) => {
  try {
    const { shortCode } = req.params;
    const url = await Url.findOneAndUpdate(
      { shortCode },
      { $inc: { clicks: 1 } },
      { new: true }
    );

    if (!url) {
      return res.status(404).json({ error: 'Short URL not found' });
    }

    res.json({ longUrl: url.longUrl });
  } catch (err) {
    console.error('Redirect error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/urls — Get all URLs for the authenticated user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const urls = await Url.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(urls);
  } catch (err) {
    console.error('Fetch URLs error:', err);
    res.status(500).json({ error: 'Failed to fetch URLs' });
  }
});

// POST /api/urls — Create a new short URL
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { longUrl, customAlias } = req.body;

    if (!longUrl) {
      return res.status(400).json({ error: 'Long URL is required' });
    }

    // Validate URL format
    try {
      new URL(longUrl);
    } catch {
      return res.status(400).json({ error: 'Please enter a valid URL' });
    }

    const shortCode = customAlias?.trim() || generateShortCode();

    // Check if alias is taken
    const existing = await Url.findOne({ shortCode });
    if (existing) {
      return res.status(400).json({ error: 'This custom alias is already taken' });
    }

    const url = new Url({
      longUrl,
      shortCode,
      userId: req.user.id,
    });

    await url.save();
    res.status(201).json(url);
  } catch (err) {
    console.error('Create URL error:', err);
    res.status(500).json({ error: 'Failed to create short URL' });
  }
});

// DELETE /api/urls/:id — Delete a URL (only the owner)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const url = await Url.findOne({ _id: req.params.id, userId: req.user.id });

    if (!url) {
      return res.status(404).json({ error: 'URL not found or not authorized' });
    }

    await url.deleteOne();
    res.json({ message: 'URL deleted successfully' });
  } catch (err) {
    console.error('Delete URL error:', err);
    res.status(500).json({ error: 'Failed to delete URL' });
  }
});

module.exports = router;
