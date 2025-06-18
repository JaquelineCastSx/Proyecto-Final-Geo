const Location = require('../models/Location');
exports.getAll = () => Location.find();
exports.getByName = name => Location.find({ name: new RegExp(name, 'i') });
exports.create = data => Location.create(data);
exports.update = (id, data) => Location.findByIdAndUpdate(id, data, { new: true });
exports.remove = id => Location.findByIdAndDelete(id);
