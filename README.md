GOIT Contacts REST API with JWT auth (Sequelize + Postgres)

Setup:

1. Copy .env.example to .env and set DB_URL and JWT_SECRET.
2. npm install
3. npm start

Endpoints (auth):
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout (protected)
GET /api/auth/current (protected)
PATCH /api/auth/subscription (protected)

Contacts (protected):
GET /api/contacts?page=1&limit=20&favorite=true
GET /api/contacts/:contactId
POST /api/contacts
PUT /api/contacts/:contactId
PATCH /api/contacts/:contactId/favorite
DELETE /api/contacts/:contactId
