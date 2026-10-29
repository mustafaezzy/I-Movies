# iMovies - Movie ticket booking made simple
MERN app: browse movies, pick showtimes, reserve seats with live availability (polling every 4s), JWT auth.

## Prerequisites
Node.js v16+, npm v8+, MongoDB (local or Atlas), VS Code, Postman (for API testing)

## Run
```
cd server && cp .env.example .env && npm install && npm run seed && npm start   # API :5000
cd client && npm install && npm run dev                                         # UI  :5173
```
## API
POST /api/auth/register | /api/auth/login
GET  /api/movies | /api/movies/:id | /api/movies/:id/shows/:showId/seats
POST /api/bookings (auth) | GET /api/bookings/mine (auth) | DELETE /api/bookings/:id (auth)
