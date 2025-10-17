const mongoose = require('mongoose');
const { Schema, Types, model } = mongoose;

const GameRoundPickSchema = new Schema({
  round: { type: Types.ObjectId, ref: 'GameRound', required: true, index: true },
  question: { type: Types.ObjectId, ref: 'Question', required: true },
  isFinal: { type: Boolean, default: false }
}, { timestamps: { createdAt: 'pickedAt', updatedAt: false } });

GameRoundPickSchema.index({ round: 1 });

module.exports = model('GameRoundPick', GameRoundPickSchema);
