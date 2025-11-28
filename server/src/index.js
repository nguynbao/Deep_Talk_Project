const express = require('express');
const app = express();
const port = 8000;
const db = require("./config/db");
const route = require('./routes');

// Basic CORS allow-all for dev usage
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.get('/', (req, res) => {
  res.send('Xin chào thế giới!');
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

db.connect();

route(app)

app.listen(port, () => {
  console.log(`Ứng dụng đang chạy tại http://localhost:${port}`);
});
