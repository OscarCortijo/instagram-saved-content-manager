const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  instagramPostId: {
    type: String,
    required: true
  },
  mediaType: {
    type: String,
    enum: ['IMAGE', 'VIDEO', 'CAROUSEL_ALBUM'],
    required: true
  },
  mediaUrl: {
    type: String
  },
  permalink: {
    type: String
  },
  extractedText: {
    type: String
  },
  transcription: {
    type: String
  },
  categories: [{
    type: String
  }],
  tags: [{
    type: String
  }],
  notes: {
    type: String
  },
  savedAt: {
    type: Date,
    default: Date.now
  },
  lastProcessed: {
    type: Date
  }
});

contentSchema.index({ user: 1, instagramPostId: 1 }, { unique: true });

module.exports = mongoose.model('Content', contentSchema);
