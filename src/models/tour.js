const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Tour = new Schema({
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  operationalHour: {
    type: String,
    required: true
  },
  ticket: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  lat: {
    type: Number,
    required: true,
  },
  long: {
    type: Number,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 0,
    max: 5,
  },
}, {
  timestamps: true
});

module.exports = mongoose.model('Tour', Tour);