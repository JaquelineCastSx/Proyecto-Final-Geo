const mongoose = require('mongoose');
const LocationSchema = new mongoose.Schema({
  name: String,
  description: String,
  longitude: Number,
  latitude: Number,
}, { timestamps: true });
module.exports = mongoose.model('Location', LocationSchema);
