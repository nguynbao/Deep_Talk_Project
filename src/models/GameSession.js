const mongoose = require('mongoose');
const { Schema, Types, model } = mongoose;

const STATUS = ['active', 'ended'];
const END_REASON = ['manual', 'exhausted']; // undefined khi đang active

const GameSessionSchema = new Schema({
  group: { type: Types.ObjectId, ref: 'Group', required: true },
  topic: { type: Types.ObjectId, ref: 'Topic', required: true },
  createdBy: { type: Types.ObjectId, ref: 'AuthUser', required: true },
  status: { type: String, enum: STATUS, default: 'active' },
  endReason: { type: String, enum: END_REASON, default: undefined },
  avoidRepeat: { type: Boolean, default: true } // không lặp câu trong session
}, { timestamps: true });

module.exports = model('GameSession', GameSessionSchema);
