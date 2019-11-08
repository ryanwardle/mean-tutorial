const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
const postsRoutes = require('./routes/posts');
const userRoutes = require('./routes/user');

mongoose.connect('mongodb+srv://ryan:' + process.env.MONGO_ATLAS_PW + '@mean-tutorial-8x7sf.mongodb.net/node-angular?retryWrites=true&w=majority').then(() => {
  console.log('Connected to database')
}).catch(() => {
  console.log('Connection failed')
});

app.use(bodyParser.json());
app.use('/images', express.static(path.join('backend/images')));
// Don't need for this project, but exists
app.use(bodyParser.urlencoded({extended: false}));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  next();
});

app.use('/api/posts', postsRoutes);
app.use('/api/user', userRoutes);

module.exports = app;


