const mongoose = require('mongoose');
const { Schema, Types, model } = mongoose;

const GameSessionPlayerSchema = new Schema({
  session: { type: Types.ObjectId, ref: 'GameSession', required: true, index: true },
  groupMember: { type: Types.ObjectId, ref: 'GroupMember', required: true },
  displayName: { type: String, required: true, trim: true }, // snapshot tên lúc bắt đầu
  turnsTaken: { type: Number, default: 0, min: 0 },
  lastPickedAt: { type: Date }
}, { timestamps: true });

GameSessionPlayerSchema.index({ session: 1, turnsTaken: 1, lastPickedAt: 1 });

module.exports = model('GameSessionPlayer', GameSessionPlayerSchema);
