# Backend Code Readme

This document explains the backend folder of the NewsMail project: its structure, purpose, dependencies, data flow, routes, controllers, models, middleware, and utility functions.

## Overview

The backend is an Express + MongoDB API written in ES modules. It supports these main features:

- Admin authentication using JWT stored in an HTTP-only cookie
- Subscriber mail collection and welcome email delivery
- Scraping tech articles from a website or RSS feed
- Storing scraped articles in MongoDB
- Generating newsletter HTML from recent articles using Groq
- Saving generated newsletter HTML in MongoDB
- Sending newsletters through Resend
- Exporting subscriber emails as CSV

## Tech Stack

- Node.js
- Express
- MongoDB + Mongoose
- JSON Web Token
- Cookie Parser
- CORS
- Axios
- Cheerio
- json2csv
- Nodemailer and Resend support for email delivery, with Resend used in the current server flow
- @google/generative-ai is installed in dependencies, but the active newsletter generation flow uses the Groq API directly from `src/index.js`

## Folder Structure

```text
Backend/
  package.json
  src/
    index.js
    Controller/
      admin.controller.js
      mail.controller.js
    Lib/
      db.js
      generateNewsletter.js
      generateToken.js
      scrape.js
    Middleware/
      verifyToken.js
    Model/
      admin.model.js
      article.model.js
      mail.model.js
      newsLetter.model.js
    Routes/
      admin.routes.js
      article.routes.js
      mail.Route.js
```

## Package Scripts

From `package.json`:

- `npm run dev` - starts the server with nodemon
- `npm start` - starts the server with Node.js

## Environment Variables

The backend expects these values in `.env`:

- `PORT` - server port
- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - secret used to sign and verify admin JWTs
- `RESEND_API_KEY` - API key for sending emails through Resend
- `GROQ_API_KEY` - API key used to call the Groq chat completion API

## Main Server File

### `src/index.js`

This is the backend entry point.

Responsibilities:

- Loads environment variables with `dotenv`
- Creates the Express app
- Enables JSON parsing, CORS, and cookie parsing
- Mounts routes for mail, admin, and articles
- Defines health/root and AI-powered newsletter routes
- Connects to MongoDB when the server starts
- Sends newsletters using Resend
- Generates newsletter HTML using Groq

#### Important flow in `index.js`

- `sendNewsLetter(to, subject, html, bcc)` uses Resend to send emails.
- `callGroqForHTML(prompt)` sends a prompt to Groq and expects clean HTML back.
- `POST /admin/generate-newsletter` fetches the latest 5 articles, builds a prompt with `generateNewsletterHTML`, sends it to Groq, cleans the response, saves it to the newsletter collection, and returns the generated HTML.
- `POST /admin/send-newsletter` verifies admin access, loads newsletter HTML if not provided, and sends the email asynchronously.

#### Registered routes

- `/news-mail` -> mail routes
- `/admin` -> admin routes
- `/articles` -> article routes

## Routes

### `src/Routes/admin.routes.js`

Admin and mail-management routes.

Endpoints:

- `POST /admin/admin-login` - admin login
- `POST /admin/admin-logout` - clears auth cookie
- `GET /admin/get-mails` - fetch all subscriber emails
- `DELETE /admin/delete-mail/:id` - delete a single mail record
- `DELETE /admin/delete-mails` - delete all mail records
- `GET /admin/verify-token` - verify admin JWT using middleware

### `src/Routes/article.routes.js`

Article scraping and newsletter storage routes.

Endpoints:

- `POST /articles/scrape` - scrape articles from a URL or RSS feed and save them
- `GET /articles/total-articles` - fetch all stored articles
- `GET /articles/total-newsletter-formats` - fetch all stored newsletter HTML documents

### `src/Routes/mail.Route.js`

Subscriber and CSV export routes.

Endpoints:

- `POST /news-mail/mails-newsletter` - subscribe a mail address and send welcome email
- `GET /news-mail/export-csv` - export all subscriber mails as CSV

## Controllers

### `src/Controller/admin.controller.js`

This file handles admin auth and mail administration.

Functions:

- `adminLogin` - checks email and password against the admin collection, generates a JWT cookie using `generateToken`, and returns admin data
- `AdminLogout` - clears the `jwt` cookie
- `GetMails` - returns all saved subscriber emails
- `deleteMail` - deletes a single mail document by ID
- `DeleteMails` - deletes all mail documents
- `adminDashboard` - simple HTML response placeholder, currently not wired as a route in the shown backend

#### Admin auth behavior

- Password comparison is done directly with `==` against the stored value
- On successful login, a JWT cookie named `jwt` is set as HTTP-only, secure, and `SameSite=None`
- Protected routes rely on this cookie

### `src/Controller/mail.controller.js`

Handles subscription and CSV export.

Functions:

- `mailsLetter` - registers a new subscriber mail, prevents duplicates, saves to MongoDB, and sends a welcome email
- `CSVDownload` - exports all subscriber emails as CSV using `json2csv`

#### Welcome email flow

When a user subscribes:

- the mail is stored in the `Mail` collection
- a welcome HTML email is generated from the inline `welcomeTemplate`
- the email is sent asynchronously through `sendNewsLetter`

## Middleware

### `src/Middleware/verifyToken.js`

This middleware protects admin routes.

Behavior:

- Reads the `jwt` cookie from the request
- Verifies it with `JWT_SECRET`
- Loads the admin from MongoDB using the decoded user ID
- Attaches the admin object to `req.admin`
- Blocks requests if the token is missing, invalid, or the admin no longer exists

## Library Files

### `src/Lib/db.js`

Connects the app to MongoDB using Mongoose.

- `ConnectDB()` calls `mongoose.connect(process.env.MONGO_URI)`
- Called when the server starts

### `src/Lib/generateToken.js`

Creates the admin JWT.

- Signs `{ userId }` with `JWT_SECRET`
- Expires in `7d`
- Stores the token in an HTTP-only cookie named `jwt`
- Uses `SameSite=None` and `secure: true`

### `src/Lib/scrape.js`

Scrapes tech articles from a URL or RSS source.

Behavior:

- Tries several feed variants in this order:
  - `/feed`
  - `/rss`
  - `/feed.xml`
  - `/rss.xml`
  - the original URL
- Uses Axios with a browser-like user agent
- Parses response data with Cheerio
- If RSS is detected, it extracts:
  - `title`
  - `link`
  - `summary`
  - `sourceUrl`
- Returns up to 5 articles

### `src/Lib/generateNewsletter.js`

Builds the prompt used to generate newsletter HTML.

Behavior:

- Receives an array of article objects
- Produces a very detailed prompt asking for premium newsletter HTML
- Embeds the article JSON directly into the prompt
- Returns the prompt string

This file does not generate HTML by itself. It prepares the prompt that is sent to Groq from `src/index.js`.

## Models

### `src/Model/admin.model.js`

Admin schema.

Fields:

- `email` - required string
- `password` - required string

Collection name is managed by Mongoose as `Admin`.

### `src/Model/mail.model.js`

Subscriber mail schema.

Fields:

- `mail` - required string
- timestamps enabled

Collection name is `Mail`.

### `src/Model/article.model.js`

Scraped article schema.

Fields:

- `sourceUrl` - required string
- `title` - required string
- `link` - required string
- `summary` - optional string
- timestamps enabled

Collection name is `Article`.

### `src/Model/newsLetter.model.js`

Newsletter HTML schema.

Fields:

- `html` - required string
- timestamps enabled

Collection name is `Newsletter`.

## Database Collections

The backend stores data in four MongoDB collections:

- `admins` via `Admin`
- `mails` via `Mail`
- `articles` via `Article`
- `newsletters` via `Newsletter`

Exact collection naming may vary because Mongoose pluralizes model names automatically.

## Request Flow Summary

### 1. Admin login

1. Client sends email and password to `POST /admin/admin-login`
2. Backend checks the admin record in MongoDB
3. JWT cookie is generated and stored in the browser
4. Protected admin requests use this cookie

### 2. Subscriber registration

1. Client sends mail to `POST /news-mail/mails-newsletter`
2. Backend checks if the mail already exists
3. New mail is saved to MongoDB
4. Welcome email is sent through Resend

### 3. Scrape articles

1. Client sends a URL to `POST /articles/scrape`
2. Backend tries common RSS/feed endpoints
3. Articles are parsed and stored in MongoDB
4. Saved articles can be read from `GET /articles/total-articles`

### 4. Generate newsletter

1. Backend loads the latest 5 articles from MongoDB
2. `generateNewsletterHTML` creates a detailed prompt
3. The prompt is sent to Groq
4. Returned HTML is cleaned and saved to the newsletter collection

### 5. Send newsletter

1. Admin calls `POST /admin/send-newsletter`
2. Middleware verifies JWT cookie
3. Backend loads newsletter HTML from request body or database
4. Email is sent asynchronously using Resend

## External Services

### Groq API

Used to generate newsletter HTML from article content.

### Resend

Used to send:

- welcome emails to new subscribers
- newsletter emails to recipients or BCC lists

## CORS Configuration

The backend allows requests from:

- `http://localhost:5173`
- `https://news-mail.vercel.app`
- `https://newsmail.nevinbali.me`

Credentials are enabled so the JWT cookie can be used in the browser.

## Notes And Current Implementation Details

- The server listens on `process.env.PORT || PORT`, where `PORT` is already taken from `process.env.PORT`, so the effective port is the environment value.
- Newsletter sending is intentionally non-blocking in `POST /admin/send-newsletter`; the API responds immediately while email delivery continues in the background.
- The backend currently expects secure cookies, which is appropriate for deployed HTTPS environments.
- Some fields and messages in the code have small spelling inconsistencies, but the backend flow is still understandable and functional.

## How To Run

1. Install dependencies inside `Backend`
2. Create a `.env` file with the required environment variables
3. Start the dev server with `npm run dev`
4. Or start production mode with `npm start`

## Quick API List

- `GET /` - backend health message
- `POST /admin/admin-login`
- `POST /admin/admin-logout`
- `GET /admin/get-mails`
- `DELETE /admin/delete-mail/:id`
- `DELETE /admin/delete-mails`
- `GET /admin/verify-token`
- `POST /admin/generate-newsletter`
- `POST /admin/send-newsletter`
- `POST /articles/scrape`
- `GET /articles/total-articles`
- `GET /articles/total-newsletter-formats`
- `POST /news-mail/mails-newsletter`
- `GET /news-mail/export-csv`

## Summary

The backend is a content and newsletter pipeline API built around MongoDB, Express, JWT auth, article scraping, AI newsletter generation, and email dispatch. Its core responsibilities are subscriber management, article ingestion, newsletter creation, and newsletter delivery.
