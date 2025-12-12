GOIT Contacts API with Email Verification (Nodemailer + ukr.net)

Setup:
1. Copy .env.example to .env and fill DB_URL, JWT_SECRET, SMTP_* and SERVER_URL.
2. npm install
3. npm start

Verification flow:
- After registering, user gets email with link: {SERVER_URL}/auth/verify/:verificationToken
- Visiting link first time: 200 Verification successful
- Visiting again: 404 User not found (token cleared)
