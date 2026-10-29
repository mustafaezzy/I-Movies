const { Schema, model } = require('mongoose');
exports.User = model('User', new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
}));
exports.Movie = model('Movie', new Schema({
  title: String, description: String, genre: String, duration: Number, poster: String,
  shows: [{ time: Date, price: Number }]
}));
exports.Booking = model('Booking', new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  movie: { type: Schema.Types.ObjectId, ref: 'Movie' },
  showId: String, seats: [String], total: Number, status: { type: String, default: 'confirmed' }
}, { timestamps: true }));
