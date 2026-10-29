require('dotenv').config();
const mongoose = require('mongoose'), { Movie } = require('./models');
const day = (d, h) => { const x = new Date(); x.setDate(x.getDate() + d); x.setHours(h, 0, 0, 0); return x; };
const shows = [{ time: day(1, 14), price: 200 }, { time: day(1, 18), price: 250 }, { time: day(2, 21), price: 300 }];
(async () => {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/imovies');
  await Movie.deleteMany();
  await Movie.insertMany([
    { title: 'Orbit Zero', genre: 'Sci-Fi', duration: 128, description: 'A crew races to save a failing space station.', poster: 'https://placehold.co/300x420/1e293b/fff?text=Orbit+Zero', shows },
    { title: 'Laugh Track', genre: 'Comedy', duration: 105, description: 'Three friends, one disastrous road trip.', poster: 'https://placehold.co/300x420/7c3aed/fff?text=Laugh+Track', shows },
    { title: 'Midnight Ledger', genre: 'Thriller', duration: 117, description: 'An accountant uncovers a city-wide secret.', poster: 'https://placehold.co/300x420/065f46/fff?text=Midnight+Ledger', shows }
  ]);
  console.log('Seeded'); process.exit();
})();
