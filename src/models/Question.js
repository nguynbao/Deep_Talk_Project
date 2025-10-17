const mongoose = require('mongoose');
const { Schema, Types, model } = mongoose;

const QuestionSchema = new Schema({
  topic: { type: Types.ObjectId, ref: 'Topic', required: true, index: true },
  content: { type: String, required: true, trim: true },
  createdBy: { type: Types.ObjectId, ref: 'AuthUser' }, // undefined = câu hệ thống seed
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

QuestionSchema.index({ topic: 1, isActive: 1 });

module.exports = model('Question', QuestionSchema);
