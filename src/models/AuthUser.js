const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const AuthUserSchema = new Schema({
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  passwordHash: { type: String, required: true },
  displayName: { type: String, trim: true }
}, { timestamps: true });

AuthUserSchema.index({ email: 1 }, { unique: true });

module.exports = model('AuthUser', AuthUserSchema);
