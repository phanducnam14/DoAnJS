const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    enum: ['user', 'admin']
  }
}, { timestamps: true });

module.exports = mongoose.model('Role', roleSchema);









