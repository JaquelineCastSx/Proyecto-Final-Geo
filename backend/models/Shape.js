const mongoose = require('mongoose');
const ShapeSchema = new mongoose.Schema({
  name: String,
  coordinates: [[Number]],
}, { timestamps: true });
module.exports = mongoose.model('Shape', ShapeSchema);
