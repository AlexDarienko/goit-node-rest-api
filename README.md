GOIT Contacts REST API with JWT auth + avatar upload (flat layout)

Setup:
1. Copy .env.example to .env and set DB_URL and JWT_SECRET.
2. npm install
3. npm start

Static files:
- public/avatars is served at http://localhost:PORT/avatars/<filename>

Auth endpoints:
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout (protected)
GET  /api/auth/current (protected)
PATCH /api/auth/subscription (protected)
PATCH /api/auth/avatars (protected, multipart/form-data file field name: avatar)

Contacts endpoints (protected):
GET /api/contacts?page=1&limit=20&favorite=true
GET /api/contacts/:contactId
POST /api/contacts
PUT /api/contacts/:contactId
PATCH /api/contacts/:contactId/favorite
DELETE /api/contacts/:contactId
