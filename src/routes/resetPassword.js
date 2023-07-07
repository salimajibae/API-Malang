const router = require('express').Router();
const Pengguna = require('../models/pengguna');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

router.post('/', async (req, res) => {
  try {
    const { email } = req.body;

    // Cari pengguna berdasarkan email
    const user = await Pengguna.findOne({ email });
    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetToken = resetToken;
    await user.save();

    // Konfigurasi Nodemailer untuk mengirim email
    const transporter = nodemailer.createTransport({
      service: process.env.SMTP_SERVICE,
      auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_FROM, // Ganti dengan email pengirim
      to: email, // Alamat email penerima reset password (diambil dari input pengguna)
      subject: 'Reset Password',
      text: `Silakan kunjungi tautan berikut untuk mereset password Anda: http://your_website/reset-password?token=${resetToken}`,
      // Ganti "your_website" dengan URL website Anda atau halaman reset password yang sesuai.
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
        res.status(500).send({ message: 'Failed to send reset password email' });
      } else {
        console.log('Email sent: ' + info.response);
        res.status(200).send({ message: 'Reset password email sent successfully' });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
});

module.exports = router;
