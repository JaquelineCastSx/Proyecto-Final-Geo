const Shape = require('../models/Shape');
exports.getAll = () => Shape.find();
exports.create = data => Shape.create(data);
exports.update = (id, data) => Shape.findByIdAndUpdate(id, data, { new: true });
exports.remove = id => Shape.findByIdAndDelete(id);
