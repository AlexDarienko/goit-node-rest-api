# goit-node-restapi-postgres

REST API for contacts using PostgreSQL + Sequelize.

## How to run

1. Install dependencies:
```
npm install
```

2. (Optional) Set DATABASE_URL environment variable. By default the project uses the provided Render external URL.
Example:
```
export DATABASE_URL="postgresql://user:pass@host:5432/dbname"
```

3. Start the app:
```
npm start
```

Server runs on port 3000 by default.

## Endpoints
- GET /api/contacts
- GET /api/contacts/:contactId
- POST /api/contacts  (body: {name, email, phone})
- PUT /api/contacts/:contactId (body: any of name/email/phone)
- PATCH /api/contacts/:contactId/favorite (body: { favorite: true|false })
- DELETE /api/contacts/:contactId
