const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Definisikan skema model untuk Pesanan Tiket
const pesananSchema = new mongoose.Schema({
  // Definisikan atribut-atribut yang diperlukan untuk pesanan tiket
  
  judulWisata: {
    type: String,
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
  nomorTelepon: {
    type: String,
    required: true,
  },
  jumlahTiket: {
    type: Number,
    required: true,
  },
  hargaTiket: {
    type: String,
    required: true,
  },
  tanggalKedatangan:{
    type:Date,
    required:true,
  },
  dayOfWeek:{
    type:Number,
    required:true,
  },
  tourId: {
    type: Schema.Types.ObjectId,

    required: true,
  },
  totalHarga: {
    type: Number,
    required: true,
  },
  paymentMethod: {
    type: String,
    required: true,
  },
});

// Buat model Pesanan berdasarkan skema
const Pesanan = mongoose.model('Pesanan', pesananSchema);

module.exports = Pesanan;