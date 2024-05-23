const mongoose = require("mongoose");

let PasswordResetSchema = new mongoose.Schema({
  userId: String,
  resetString: String,
  createdAt: { type: Date, default: new Date(Date.now() + 2 * 60 * 60 * 1000),},
  expiresAt: { type: Date, default: new Date(Date.now() + 3 * 60 * 60 * 1000)},
})

exports.PasswordReset = mongoose.model("PasswordReset", PasswordResetSchema);