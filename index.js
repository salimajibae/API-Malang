require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const userRoutes = require('./src/routes/users');
const authRoutes = require('./src/routes/auth');
const pesananRoutes = require('./src/routes/pesanan'); // Import rute pesanan
const pesananController = require('./src/controllers/pesananController'); // Import pesananController
const tator=require('./src/routes/tator');
const app = express();
const tourRoutes = require('./src/routes/routes');
const orderRoutes = require('./src/routes/order');
const resetPasswordRouter = require('./src/routes/resetPassword');

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    cb(null, new Date().getTime() + '-' + file.originalname);
  }
});



const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' || 
    file.mimetype === 'image/jpg' || 
    file.mimetype === 'image/jpeg') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single('image'));




app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use('/v1/pesona-malang', tourRoutes);

app.use('/reset-password', resetPasswordRouter);

//dibawah untuk admin
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/order', orderRoutes);

//dibawah api untuk user frontend
app.use('/api/login', tator);
app.use('/api/register', tator);
app.use('/api/profil',tator);
// Endpoint untuk mengunggah gambar


// Gunakan rute pesanan
app.use('/v1/pesona-malang/pesanan', pesananRoutes);

// Penanganan permintaan POST pada rute pesanan
app.post('/v1/pesona-malang/pesanan', pesananController.createPesanan);
app.get('/v1/pesona-malang/pesanan', pesananController.getAllPesanan);
app.get('/v1/pesona-malang/pesanan/:pesananId', pesananController.getPesananById);
app.delete('/v1/pesona-malang/pesanan/:pesananId', pesananController.deletePesanan);
app.put('/v1/pesona-malang/pesanan/:pesananId', pesananController.updatePesanan);


app.use((error, req, res, next) => {
  const status = error.errorStatus || 500;
  const message = error.message;
  const data = error.data;

  res.status(status).json({ message, data });
});

mongoose.connect(process.env.DB)
  .then(() => {
    app.listen(process.env.PORT || 4000, () => console.log('Connection Success'));
  })
  .catch(err => console.log(err));
