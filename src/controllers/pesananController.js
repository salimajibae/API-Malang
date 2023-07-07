// Import model yang diperlukan
const Pesanan = require('../models/pesanan');

// Contoh fungsi untuk membuat pesanan tiket
exports.createPesanan = async (req, res) => {
  try {
    // Lakukan logika validasi atau pemrosesan lainnya
    // Misalnya, validasi data yang diterima dari client dan simpan ke database
    // Anda dapat menggunakan model Pesanan untuk melakukan operasi CRUD terkait pesanan tiket

    // Contoh: Simpan pesanan tiket ke database
    const pesanan = new Pesanan(req.body);
    await pesanan.save();

    res.status(201).json({ message: 'Pesanan tiket berhasil dibuat', data: pesanan });
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan saat membuat pesanan tiket', error: error.message });
  }
};

// Contoh fungsi untuk mendapatkan semua pesanan tiket
exports.getAllPesanan = async (req, res) => {
  try {
    // Lakukan logika untuk mendapatkan semua pesanan tiket dari database
    const pesananList = await Pesanan.find();

    if (pesananList.length > 0) {
      res.status(200).json({ message: 'Berhasil mendapatkan pesanan tiket', data: pesananList });
    } else {
      res.status(200).json({ message: 'Tidak ada pesanan tiket yang ditemukan', data: pesananList });
    }
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan saat mendapatkan pesanan tiket', error: error.message });
  }
};

// Contoh fungsi untuk mendapatkan pesanan tiket berdasarkan ID
exports.getPesananById = async (req, res) => {
  try {
    // Lakukan logika untuk mendapatkan pesanan tiket berdasarkan ID dari database
    const pesanan = await Pesanan.findById(req.params.pesananId);

    if (!pesanan) {
      return res.status(404).json({ message: 'Pesanan tiket tidak ditemukan' });
    }

    res.status(200).json({ data: pesanan });
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan saat mendapatkan pesanan tiket', error: error.message });
  }
};

// Contoh fungsi untuk mengupdate pesanan tiket
exports.updatePesanan = async (req, res) => {
  try {
    // Lakukan logika validasi atau pemrosesan lainnya
    // Misalnya, validasi data yang diterima dari client dan update data di database

    // Contoh: Update pesanan tiket berdasarkan ID
    const pesanan = await Pesanan.findByIdAndUpdate(req.params.pesananId, req.body, {
      new: true, // Mengembalikan data yang sudah diupdate
      runValidators: true, // Menjalankan validasi pada skema model
    });

    if (!pesanan) {
      return res.status(404).json({ message: 'Pesanan tiket tidak ditemukan' });
    }

    res.status(200).json({ message: 'Pesanan tiket berhasil diupdate', data: pesanan });
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan saat mengupdate pesanan tiket', error: error.message });
  }
};

// Contoh fungsi untuk menghapus pesanan tiket
exports.deletePesanan = async (req, res) => {
  try {
    // Lakukan logika untuk menghapus pesanan tiket berdasarkan ID dari database
    const pesanan = await Pesanan.findByIdAndDelete(req.params.pesananId);

    if (!pesanan) {
      return res.status(404).json({ message: 'Pesanan tiket tidak ditemukan' });
    }

    res.status(200).json({ message: 'Pesanan tiket berhasil dihapus', data: pesanan });
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan saat menghapus pesanan tiket', error: error.message });
  }
};
