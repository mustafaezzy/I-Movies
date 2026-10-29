require('dotenv').config();
const express = require('express'), mongoose = require('mongoose'), cors = require('cors');
const app = express();
app.use(cors(), express.json());
app.use('/api/auth', require('./routes/auth'));
app.use('/api/movies', require('./routes/movies'));
app.use('/api/bookings', require('./routes/bookings'));
app.use((e, req, res, next) => res.status(500).json({ message: e.message }));
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/imovies')
  .then(() => app.listen(process.env.PORT || 5000, () => console.log('API running')))
  .catch(e => console.error(e));
