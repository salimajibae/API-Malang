const express = require('express');
const router = express.Router();

const pesananController = require('../controllers/pesananController');

// Rute untuk membuat pesanan tiket
router.post('/pesanan', pesananController.createPesanan);

// Rute untuk mendapatkan semua pesanan tiket
router.get('/pesanan', pesananController.getAllPesanan);

// Rute untuk mendapatkan pesanan tiket berdasarkan ID
router.get('/pesanan/:pesananId', pesananController.getPesananById);

// Rute untuk mengupdate pesanan tiket
router.put('/pesanan/:pesananId', pesananController.updatePesanan);

// Rute untuk menghapus pesanan tiket
router.delete('/pesanan/:pesananId', pesananController.deletePesanan);

module.exports = router;
