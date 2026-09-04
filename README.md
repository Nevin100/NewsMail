# NewsMail

NewsMail is a full-stack newsletter platform for collecting subscribers, sourcing tech-news articles, generating newsletter HTML with Groq, and dispatching campaigns from an admin dashboard.

The project runs as two Dockerized services: a React/Vite frontend served by Nginx and an Express/MongoDB API. The production deployment uses AWS container infrastructure and a custom domain.

## What it does

- Lets visitors subscribe to the newsletter and sends a welcome email through Resend.
- Provides an admin login backed by JWT cookies and hashed passwords.
- Lets an admin view and manage subscribers, export subscriber data as CSV, and dispatch a newsletter to selected BCC recipients.
- Scrapes an RSS feed or supplied source URL, normalizes up to five articles, and stores them in MongoDB.
- Uses Groq (`llama-3.1-8b-instant`) to generate responsive HTML newsletter content from saved articles.
- Provides desktop and mobile previews before a campaign is sent.

## Production architecture

```text
Browser
  |
  +-- Cloudflare: authoritative DNS resolution, TLS, CDN and WAF protections
  |
  +-- CloudFront: delivery and edge monitoring
  |
  +-- Application Load Balancer
        |-- Frontend ECS service -> Nginx -> React/Vite build
        `-- Backend ECS service  -> Express API -> MongoDB + Groq + Resend

GitHub Actions (push to main)
  -> build frontend and backend Docker images
  -> push images to Amazon ECR
  -> force ECS service deployments
```

The frontend receives its API base URL at image-build time through `VITE_API_URL`. In the deployed same-origin setup, that value is expected to be `/api`, with the edge/load-balancer routing `/api/*` to the backend service.

## Stack

| Area | Technologies |
| --- | --- |
| Frontend | React 19, Vite, React Router, Redux Toolkit, Tailwind CSS, DaisyUI |
| Backend | Node.js, Express, Mongoose, JWT, bcryptjs, express-rate-limit |
| Data and integrations | MongoDB, Groq API, Resend, Axios, Cheerio, json2csv |
| Containerization | Docker, Nginx, Docker Compose |
| Delivery and cloud | GitHub Actions, Amazon ECR, Amazon ECS, Application Load Balancer, IAM, Secrets Manager, CloudFront, Cloudflare DNS/CDN/WAF |

## Repository layout

```text
.
├── Backend/
│   ├── src/
│   │   ├── Controller/       # subscription and admin handlers
│   │   ├── Lib/              # MongoDB, scraping, JWT and AI helpers
│   │   ├── Middleware/       # auth, validation and rate limiting
│   │   ├── Model/            # Admin, Mail, Article and Newsletter schemas
│   │   └── Routes/           # API route modules
│   └── Dockerfile
├── Frontend/
│   ├── src/                  # React app, dashboard, pages and API client
│   └── Dockerfile
├── .github/workflows/deploy.yml
├── docker-compose.yml
└── docs/PROJECT_MEMORY.md
```

## Local development

### 1. Configure the API

Create `Backend/.env` locally. Never commit this file.

```dotenv
PORT=8000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=replace_with_a_long_random_secret
GROQ_API_KEY=your_groq_key
RESEND_API_KEY=your_resend_key
```

An admin account must already exist in MongoDB with a bcrypt-hashed password before admin login can succeed.

### 2. Run with Node.js

```bash
# Terminal 1
cd Backend
npm install
npm run dev

# Terminal 2
cd Frontend
npm install
npm run dev
```

Set `VITE_API_URL=http://localhost:8000/api` for the local frontend build if it is not already supplied by your environment.

### 3. Run with Docker Compose

```bash
docker compose up --build
```

This starts the backend on port `8000` and the Nginx-served frontend on port `80`. Docker Compose reads backend secrets from `Backend/.env`.

## API overview

All API routes are mounted below `/api`.

| Method | Route | Purpose |
| --- | --- | --- |
| `GET` | `/api/health` | Health check |
| `POST` | `/api/news-mail/mails-newsletter` | Create a subscription and initiate a welcome email |
| `GET` | `/api/news-mail/export-csv` | Export subscriber data as CSV |
| `POST` | `/api/admin/admin-login` | Authenticate an admin |
| `POST` | `/api/admin/admin-logout` | Clear the admin session cookie |
| `GET` | `/api/admin/get-mails` | List subscribers |
| `DELETE` | `/api/admin/delete-mail/:id` | Delete one subscriber |
| `DELETE` | `/api/admin/delete-mails` | Delete all subscribers |
| `GET` | `/api/admin/verify-token` | Validate the admin session |
| `POST` | `/api/articles/scrape` | Scrape and persist articles from a URL or feed |
| `GET` | `/api/articles/total-articles` | List saved articles |
| `GET` | `/api/articles/total-newsletter-formats` | List saved newsletter HTML documents |
| `POST` | `/admin/generate-newsletter` | Generate and save newsletter HTML from recent articles |
| `POST` | `/admin/send-newsletter` | Start newsletter dispatch to a recipient or BCC list |

## Security controls in the application

- Passwords are compared with `bcryptjs` and admin authentication uses a seven-day HTTP-only, secure JWT cookie.
- The general API limiter allows 100 requests per 15-minute window; the login limiter allows 10 attempts per 15-minute window.
- CORS is credential-enabled and has explicit allowed origins. Keep this allowlist synchronized with production domains.
- Runtime secrets belong in local `.env` files during development and AWS Secrets Manager / GitHub Actions secrets in deployment; never commit credentials.
- Cloudflare manages authoritative DNS resolution, edge TLS, CDN delivery, and WAF protections for the public domain.
- CloudFront monitoring is used to observe request volume, cache behavior, and 4xx/5xx responses at the edge.

## CI/CD

`.github/workflows/deploy.yml` is triggered by pushes to `main`. It authenticates to AWS through GitHub Actions secrets, logs into ECR, builds and pushes the backend and frontend images, and calls `aws ecs update-service --force-new-deployment` for both services.

Required GitHub repository secrets:

```text
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
```

The IAM principal used by those credentials should be limited to the ECR and ECS actions needed for deployment. An OIDC-based GitHub Actions role is a recommended later improvement because it removes long-lived AWS keys from GitHub.

## Operational checklist

- Confirm `GET /api/health` returns `200` after every deployment.
- Confirm frontend API calls use the deployed `VITE_API_URL` and never a stale development endpoint.
- Watch edge/CDN request volume, cache behavior, and 4xx/5xx signals after releases.
- Keep the ALB target groups healthy before considering a deployment complete.
- Rotate compromised or unused credentials immediately.

