const mongoose = require('mongoose');
const { Schema, Types, model } = mongoose;

const GroupMemberSchema = new Schema({
  group: { type: Types.ObjectId, ref: 'Group', required: true, index: true },
  memberName: { type: String, required: true, trim: true },
  user: { type: Types.ObjectId, ref: 'AuthUser' } // tuỳ chọn: map tới user thật
}, { timestamps: true });

GroupMemberSchema.index({ group: 1 });

module.exports = model('GroupMember', GroupMemberSchema);
