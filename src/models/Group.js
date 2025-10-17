const mongoose = require('mongoose');
const { Schema, Types, model } = mongoose;

const GroupSchema = new Schema({
  name: { type: String, required: true, trim: true },
  owner: { type: Types.ObjectId, ref: 'AuthUser', required: true }
}, { timestamps: true });

module.exports = model('Group', GroupSchema);
