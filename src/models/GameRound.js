const mongoose = require('mongoose');
const { Schema, Types, model } = mongoose;

const ROUND_STATUS = ['pending', 'completed'];

const GameRoundSchema = new Schema({
  session: { type: Types.ObjectId, ref: 'GameSession', required: true, index: true },
  roundNo: { type: Number, required: true, min: 1 },
  assignedPlayer: { type: Types.ObjectId, ref: 'GameSessionPlayer', required: true },
  status: { type: String, enum: ROUND_STATUS, default: 'pending' },
  finalQuestion: { type: Types.ObjectId, ref: 'Question' },
  rerollCount: { type: Number, default: 0, min: 0 },
  completedAt: { type: Date }
}, { timestamps: true });

GameRoundSchema.index({ session: 1, roundNo: 1 }, { unique: true });
GameRoundSchema.index({ session: 1, status: 1 });

module.exports = model('GameRound', GameRoundSchema);
