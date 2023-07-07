const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  tiket_id: {
    type: Number,
    required: true,
  },
  nama: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  judulWisata: {
    type: String,
    required: true,
  },
  jumlahTiket: {
    type: String,
    required: true,
  },
  hargaTiket: {
    type: String,
    required: true,
  },
  tanggalKedatangan: {
    type: String,
    required: true,
  },
  paymentMethod: {
    type: String,
    required: true,
  },
  response_midtrans: {
    type: String,
    required: true,
  },


}, {
  timestamps: true,
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;