const mongoose = require('mongoose');
const { Schema, model } = mongoose;

// 'family', 'friends', 'love' (có thể mở rộng)
const TopicSchema = new Schema({
  code: { type: String, required: true, unique: true, trim: true },
  title: { type: String, required: true, trim: true }
}, { timestamps: true });

TopicSchema.index({ code: 1 }, { unique: true });

module.exports = model('Topic', TopicSchema);
