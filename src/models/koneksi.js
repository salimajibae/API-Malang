const MongoClient = require('mongodb').MongoClient;

// URL koneksi MongoDB
const url = 'mongodb://localhost:27017';

// Nama database
const dbName = 'nama_database';

// Membuat koneksi ke MongoDB
const client = new MongoClient(url, { useUnifiedTopology: true });

// Membuka koneksi ke MongoDB
client.connect((error) => {
  if (error) {
    console.error('Koneksi MongoDB gagal: ', error);
  } else {
    console.log('Koneksi MongoDB berhasil');
  }
});

// Mendapatkan objek database
const db = client.db(dbName);

module.exports = db;
