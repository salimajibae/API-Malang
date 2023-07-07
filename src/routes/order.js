const express = require('express');
const router = express.Router();
const Order = require('../models/order');

const midtransClient = require('midtrans-client');

// Create Core API instance
const coreApi = new midtransClient.CoreApi({
  isProduction: false,
  serverKey: 'SB-Mid-server-VQT0L2Ih5MUd1J50D6razYG8',
  clientKey: 'SB-Mid-client-ADrhrSvvo6SAtIMgY'
});

router.get('/', function(req, res, next) {
  Order.find()
    .then(data => {
      var tampilData = data.map(item => {
        const responseMidtrans = JSON.parse(item.response_midtrans);
        return {
          id: item.id,
          tiket_id: item.tiket_id,
          nama: item.nama,
          email: item.email,
          judulWisata:item.judulWisata,
          tanggalKedatangan:item.tanggalKedatangan,
      jumlahTiket:item.jumlahTiket,
      hargaTiket:item.hargaTiket,
      paymentMethod:item.paymentMethod,

      
          response_midtrans: responseMidtrans,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
          transaction_status: responseMidtrans.transaction_status // Menambahkan transaction_status
        }
      });
      res.json({
        status: true,
        pesan: "Berhasil Tampil",
        data: tampilData
      });
    })
    .catch(err => {
      res.json({
        status: false,
        pesan: "Gagal tampil: " + err.message,
        data: []
      });
    });
});
router.post('/charge', function(req, res, next) {
  coreApi.charge(req.body)
    .then(chargeResponse => {
      var dataOrder = new Order({
        id: chargeResponse.order_id,
        tiket_id: req.body.tiket_id,
        nama: req.body.nama,
        email: req.body.email,
        judulWisata:req.body.judulWisata,
        tanggalKedatangan:req.body.tanggalKedatangan,
      jumlahTiket:req.body.jumlahTiket,
      hargaTiket:req.body.hargaTiket,
      paymentMethod:req.body.paymentMethod,
        response_midtrans: JSON.stringify(chargeResponse),
        
        
      });
      dataOrder.save()
        .then(data => {
          res.json({
            status: true,
            pesan: "Berhasil Order",
            data: data
          });
        })
        .catch(err => {
          res.json({
            status: false,
            pesan: "Gagal Order: " + err.message,
            data: []
          });
        });
    })
    .catch(e => {
      res.json({
        status: false,
        pesan: "Gagal order: " + e.message,
        data: []
      });
    });
});

router.post('/notifikasi', function(req, res, next) {
  coreApi.transaction.notification(req.body)
    .then(statusResponse => {
      let orderId = statusResponse.order_id;
      let responseMidtrans = JSON.stringify(statusResponse);
      Order.findOneAndUpdate(
        { id: orderId },
        { response_midtrans: responseMidtrans },
        { new: true }
      )
        .then(() => {
          res.json({
            status: true,
            pesan: "Berhasil Notifikasi",
            data: []
          });
        })
        .catch(err => {
          res.status(500).json({
            status: false,
            pesan: "Gagal Notifikasi: " + err.message,
            data: []
          });
        });
    });
});

router.get('/notifikasi', function(req, res, next) {
  // Mengambil data notifikasi dari database atau sumber lainnya
  // Misalnya, menggunakan Order.findOne untuk mengambil data notifikasi terakhir
  Order.findOne({}, {}, { sort: { 'createdAt': -1 } })
    .then(order => {
      if (order) {
        // Mengambil data notifikasi dan mengirimkannya sebagai respons
        const responseMidtrans = JSON.parse(order.response_midtrans);
        res.json(responseMidtrans);
      } else {
        // Jika tidak ada data notifikasi, kirimkan respons kosong
        res.json({});
      }
    })
    .catch(err => {
      // Tangani kesalahan saat mengakses data notifikasi
      res.status(500).json({
        status: false,
        pesan: "Gagal mendapatkan notifikasi: " + err.message,
        data: []
      });
    });
});

router.get('/status/:order_id', function(req, res, next) {
  coreApi.transaction.status(req.params.order_id)
    .then(statusResponse => {
      let responseMidtrans = JSON.stringify(statusResponse);
      Order.findOneAndUpdate(
        { id: req.params.order_id },
        { response_midtrans: responseMidtrans },
        { new: true }
      )
        .then(order => {
          res.json({
            status: true,
            pesan: "Berhasil cek status",
            data: {
              id:order.id,
              judulWisata:order.judulWisata,
              name: order.nama,
              email: order.email,
              jumlahTiket:order.jumlahTiket,
              hargaTiket:order.hargaTiket,
              tanggalKedatangan:order.tanggalKedatangan,
              paymentMethod:order.paymentMethod,
              kodeBoking:order.kodeBoking,
              transaction_status: statusResponse.transaction_status,
              order_id: statusResponse.order_id,
              transaction_id: statusResponse.transaction_id,
              gross_amount: statusResponse.gross_amount,
              permata_va_number: statusResponse.permata_va_number,
              // Include other relevant data as needed
            }
          });
        })
        .catch(err => {
          res.json({
            status: false,
            pesan: "Gagal cek status: " + err.message,
            data: []
          });
        });
    });
});
router.put('/status/:order_id', function(req, res, next) {
    const orderId = req.params.order_id;
  
    Order.findOneAndUpdate(
      { id: orderId },
      { $set: { 'response_midtrans.transaction_status': 'success' } },
      { new: true }
    )
      .then(updatedOrder => {
        if (updatedOrder) {
          res.json({
            status: true,
            pesan: "Berhasil mengubah status",
            data: updatedOrder
          });
        } else {
          res.json({
            status: false,
            pesan: "Gagal mengubah status: Data tidak ditemukan",
            data: null
          });
        }
      })
      .catch(err => {
        res.json({
          status: false,
          pesan: "Gagal mengubah status: " + err.message,
          data: null
        });
      });
  });

  router.delete('/:order_id', function(req, res, next) {
    const orderId = req.params.order_id;
  
    Order.findOneAndDelete({ id: orderId })
      .then(deletedOrder => {
        if (deletedOrder) {
          res.json({
            status: true,
            pesan: "Berhasil menghapus order",
            data: deletedOrder
          });
        } else {
          res.json({
            status: false,
            pesan: "Gagal menghapus order: Data tidak ditemukan",
            data: null
          });
        }
      })
      .catch(err => {
        res.json({
          status: false,
          pesan: "Gagal menghapus order: " + err.message,
          data: null
        });
      });
  });
module.exports = router;
