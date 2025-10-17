const mongoose = require('mongoose');
const { Schema, Types, model } = mongoose;

const QuestionUsedSchema = new Schema({
  session: { type: Types.ObjectId, ref: 'GameSession', required: true },
  question: { type: Types.ObjectId, ref: 'Question', required: true }
}, { timestamps: true });

QuestionUsedSchema.index({ session: 1, question: 1 }, { unique: true });

module.exports = model('QuestionUsed', QuestionUsedSchema);
