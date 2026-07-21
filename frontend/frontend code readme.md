# Frontend Code Readme

This document explains the frontend folder of the NewsMail project: its structure, purpose, dependencies, routing, state flow, API usage, component logic, styling setup, and the role of every main file in `frontend/src`.

## Overview

The frontend is a React + Vite application that provides two major experiences:

- Public newsletter subscription pages for users
- Admin pages for managing subscribers, articles, scraped data, newsletter generation, and newsletter delivery

The UI is built with Tailwind CSS 4 and DaisyUI themes, with additional support from Zustand, Redux Toolkit Query, React Router, React Hot Toast, Recharts, Lucide icons, React Icons, ExcelJS, and FileSaver.

## Tech Stack

- React 19
- Vite
- React Router DOM
- Redux Toolkit Query
- Zustand
- Axios
- Tailwind CSS 4
- DaisyUI themes
- React Hot Toast
- Recharts
- Lucide React and React Icons
- ExcelJS
- FileSaver
- SweetAlert2
- uuid
- @material-tailwind/react, @splinetool/react-spline, and other UI libraries installed in dependencies

## Frontend Folder Structure

```text
frontend/
  eslint.config.js
  index.html
  package.json
  vite.config.js
  public/
  src/
    App.jsx
    index.css
    main.jsx
    assets/
    Components/
      Footer.jsx
      Navbar.jsx
      NewsLetterImage.jsx
      RenderNewsletter.jsx
      Admin/
        AdminDashboard.jsx
        AdminImage.jsx
        AdminLogin.jsx
        Articles.jsx
        NewsLetter.jsx
        ScrapeWebsite.jsx
        SendMail.jsx
    Constants/
      index.js
    Context/
      ProtectedRoute.jsx
      useThemeStroe.js
    Pages/
      About.jsx
      NewsLetterPage.jsx
      Settings.jsx
    Redux/
      store.js
      Features/
        Mail.js
    Routes/
      Router.jsx
    Util/
      axios.js
      BaseUrl.js
```

## Package Scripts

From `frontend/package.json`:

- `npm run dev` - starts the Vite development server
- `npm run build` - creates a production build
- `npm run lint` - runs ESLint
- `npm run preview` - previews the production build locally

## Backend Connection

The frontend currently talks to the deployed backend at:

- `https://newsmail-2s5a.onrender.com`

That URL is hardcoded in multiple frontend files:

- `src/Util/BaseUrl.js`
- `src/Context/ProtectedRoute.jsx`
- `src/Components/Admin/AdminLogin.jsx`
- `src/Components/Admin/AdminDashboard.jsx`
- `src/Components/Admin/Articles.jsx`
- `src/Components/Admin/NewsLetter.jsx`
- `src/Components/Admin/ScrapeWebsite.jsx`
- `src/Components/Admin/SendMail.jsx`
- `src/Redux/Features/Mail.js`

If the backend host changes, those references need to be updated.

## App Bootstrap

### `src/main.jsx`

This is the frontend entry file.

What it does:

- Imports the global stylesheet from `src/index.css`
- Wraps the app in the Redux `<Provider>`
- Mounts the React Router `<RouterProvider>` using the app router from `src/Routes/Router.jsx`
- Renders the app into the root DOM node

## Root Layout

### `src/App.jsx`

This is the main layout shell used by the router.

What it does:

- Reads the active theme from Zustand store `useThemeStore`
- Sets the `data-theme` attribute on the main wrapper so DaisyUI theme classes work
- Renders the global `Navbar`
- Renders route content via `<Outlet />`
- Renders the global `Footer`
- Mounts `react-hot-toast`'s `<Toaster />`

This means every page shares the same navigation, theme, toast system, and footer.

## Routing

### `src/Routes/Router.jsx`

This file defines the client-side routing table.

Public routes:

- `/` -> `NewsLetterPage`
- `/settings` -> `Settings`
- `/about` -> `About`
- `/admin` -> `AdminLogin`

Protected admin routes:

- `/admin-dashboard` -> `AdminDashboard`
- `/admin/articles` -> `Articles`
- `/admin/send-mail` -> `SendMail`
- `/admin/newsLetter` -> `NewsLetter`
- `/admin/scrape` -> `ScrapeWebsite`

The protected routes are wrapped inside `ProtectedRoute`.

## Auth Guard

### `src/Context/ProtectedRoute.jsx`

This component protects admin pages.

How it works:

- Calls `GET /admin/verify-token` on the backend through the shared Axios instance
- Uses `withCredentials: true` so the cookie-based JWT can be sent
- While verification is in progress, it shows a spinner
- If the token is valid, it renders `<Outlet />`
- If invalid, it redirects to `/admin`

This is the frontend side of the cookie-based admin auth flow.

## HTTP Client Setup

### `src/Util/BaseUrl.js`

Exports the backend base URL string used across the app.

### `src/Util/axios.js`

Creates a shared Axios instance.

Configuration:

- `baseURL` is the backend URL from `BaseUrl.js`
- `withCredentials: true` is enabled so auth cookies can be sent

This instance is used by parts of the app that need authenticated requests.

## State Management

The project uses two different state systems:

- Redux Toolkit Query for newsletter subscription API calls
- Zustand for theme management

### `src/Redux/store.js`

Sets up the Redux store and mounts the RTK Query API reducer.

### `src/Redux/Features/Mail.js`

This is the Redux Toolkit Query API slice for newsletter subscription.

It defines one mutation:

- `useAddMailMutation()` -> sends `POST /news-mail/mails-newsletter`

This mutation is used on the public newsletter signup page.

### `src/Context/useThemeStroe.js`

This is the Zustand store for theme selection.

Behavior:

- Theme is loaded from `localStorage` key `chat-theme`
- Default theme is `luxury`
- `setTheme(theme)` updates both localStorage and the store state

### `src/Constants/index.js`

Exports the list of DaisyUI themes shown in the Settings page.

## Global Styling And Design Setup

### `src/index.css`

This file sets the visual foundation.

What it does:

- Imports Google Fonts `Poppins` and `Roboto`
- Imports Tailwind CSS
- Enables DaisyUI with all themes
- Prevents horizontal overflow on the body

The visual system relies heavily on Tailwind utility classes and DaisyUI theme tokens such as `bg-base-100`, `text-primary`, and `btn-primary`.

### `vite.config.js`

Vite configuration includes:

- React plugin
- Tailwind CSS Vite plugin

### `eslint.config.js`

Configures ESLint for JavaScript and JSX files.

Rules and behavior:

- Uses browser globals
- Enables React Hooks rules
- Enables React Refresh rules
- Ignores the `dist` folder
- Enforces `no-unused-vars` with a small exception for uppercase names

## Public Pages

### `src/Pages/NewsLetterPage.jsx`

This is the public newsletter subscription landing page.

Main logic:

- Maintains local form state for `email`
- Uses `useAddMailMutation()` to submit the email to the backend
- Shows a loading state during submission
- On success, clears the form and shows a success toast
- On duplicate email, shows a specific conflict toast
- On server errors, shows a fallback error toast

UI behavior:

- Two-column layout on large screens
- Left side contains the subscription form
- Right side uses `NewsLetterImage` as the visual panel
- Uses Lucide icons for form and CTA styling

### `src/Pages/Settings.jsx`

This page is the theme selector.

Main logic:

- Reads the current theme from Zustand
- Displays a theme preview card
- Renders all DaisyUI themes from `THEMES`
- Clicking a theme updates the global theme immediately

This page is the primary theme customization screen for the app.

### `src/Pages/About.jsx`

This is the product/about page.

What it contains:

- A mission card explaining what NewsMailer does
- A second card explaining the product value proposition
- A creator section for Nevin Bali
- Contact buttons for email and GitHub

This page is mostly informational and uses a highly stylized layout.

## Shared UI Components

### `src/Components/Navbar.jsx`

The main top navigation bar.

Features:

- Fixed header with blur backdrop
- Desktop navigation links for About, Admin, and Settings
- Active-route highlighting using `useLocation`
- Mobile drawer menu with open/close toggle
- Brand logo and title on the left

The navbar is shared across all routes through `App.jsx`.

### `src/Components/Footer.jsx`

The global site footer.

Features:

- Brand section with social links
- Quick navigation links
- Contact card with email
- CTA card encouraging newsletter signup
- Bottom credits bar with current year

Like the navbar, this is mounted globally in `App.jsx`.

### `src/Components/NewsLetterImage.jsx`

A decorative right-side panel used on the subscription page.

Behavior:

- Hidden on smaller screens
- Shows a stylized grid of animated tiles
- Centers a mail icon in the middle tile
- Displays the custom title passed in as a prop

### `src/Components/RenderNewsletter.jsx`

Used to render saved newsletter HTML inside the admin UI.

Behavior:

- Accepts HTML as a prop
- Displays it inside an `iframe`
- Uses `srcDoc` to render the email content safely in preview form
- Applies sandboxing to isolate the preview

### `src/Components/Admin/AdminImage.jsx`

A decorative admin-side illustration component.

Behavior:

- Hidden on smaller screens
- Uses placeholder blocks and animation to create a visual dashboard-style panel
- Accepts a `title` prop

This appears to be an auxiliary UI component for admin sections.

## Admin Pages And Components

The admin section is a dashboard-style set of screens that share a left sidebar and consistent visual treatment.

### `src/Components/Admin/AdminLogin.jsx`

This is the admin login screen.

Main logic:

- Local state for `email`, `password`, `showPassword`, and submit loading
- Submits credentials to `POST /admin/admin-login`
- On success, shows a toast and navigates to `/admin-dashboard`
- On failure, shows the backend error message if available
- Includes a password visibility toggle

This screen is the entry point for the protected admin area.

### `src/Components/Admin/AdminDashboard.jsx`

This is the main admin control center.

Main data loading:

- Fetches subscribers from `GET /admin/get-mails`
- Fetches article count from `GET /articles/total-articles`
- Fetches newsletter count from `GET /articles/total-newsletter-formats`

Main features:

- Stats cards for signups, newsletters, and articles
- Line chart for growth analytics using Recharts
- Pie chart for mail status using Recharts
- Search box to filter subscribers by email
- Pagination for the subscriber table
- Delete action for individual mail records
- Logout button that clears the admin session and redirects to login
- A sidebar that links to dashboard, articles, send mail, scrape, and newsletter pages

There is also an incomplete download button placeholder in the UI, but the file includes a separate helper for filtered export logic.

### `src/Components/Admin/Articles.jsx`

This page shows the scraped article library.

Main logic:

- Fetches all articles from `GET /articles/total-articles`
- Renders each article as a content card
- Shows source hostname, date, title, summary, and links
- Provides a button to navigate to the scrape page
- Reuses the common admin sidebar structure

### `src/Components/Admin/SendMail.jsx`

This page manages newsletter dispatch to subscribers.

Main logic:

- Fetches subscribers from `GET /admin/get-mails`
- Sorts them by creation date
- Supports selecting individual subscribers via checkboxes
- Supports select-all behavior
- Maintains selected email state for bulk send
- Uses `POST /admin/send-newsletter` with `bcc` and `subject`
- Shows a floating action bar when recipients are selected
- Includes pagination for the subscriber list

This screen is the campaign launch panel for sending newsletter emails.

### `src/Components/Admin/NewsLetter.jsx`

This page shows the newsletter archive.

Main logic:

- Fetches saved newsletter HTML documents from `GET /articles/total-newsletter-formats`
- Sorts newsletters by newest first
- Renders each newsletter using `RenderNewsletter`
- Displays timestamps and archive numbering
- Uses a card-based preview layout

This page is for reviewing previously generated newsletter layouts.

### `src/Components/Admin/ScrapeWebsite.jsx`

This page is the scraping and AI generation workspace.

Main logic:

- Accepts a website URL from the admin
- Calls `POST /articles/scrape` to extract articles
- Stores returned scraped articles in local state
- Allows clearing the scraped list
- Calls `POST /admin/generate-newsletter` to generate AI newsletter HTML
- Stores generated newsletter HTML in local state
- Provides a desktop/mobile preview toggle for the generated newsletter
- Navigates to the send-mail page once the newsletter is ready

This is one of the most important operational screens in the frontend because it connects scraping, generation, and dispatch.

## Frontend Data Flow Summary

### Public signup flow

1. User opens `/`
2. Enters email on the newsletter form
3. `useAddMailMutation()` sends the email to the backend
4. Backend stores the subscriber and sends a welcome email
5. Frontend shows a success or duplicate toast

### Admin auth flow

1. Admin opens `/admin`
2. Submits email and password
3. Backend issues a JWT cookie on success
4. Protected routes call `/admin/verify-token`
5. If valid, the admin can access dashboard pages

### Scrape to newsletter flow

1. Admin opens `/admin/scrape`
2. Enters a target URL
3. Frontend requests scraping from the backend
4. Scraped articles appear locally
5. Admin triggers AI newsletter generation
6. Generated HTML is previewed in an iframe
7. Admin can move to the send-mail page to dispatch it

### Archive and management flow

1. Dashboard loads subscriber and content stats
2. Articles page shows stored scraped articles
3. NewsLetter page shows saved newsletter HTML archives
4. Send Mail page allows bulk delivery to selected subscribers

## Notable Implementation Details

- The app uses DaisyUI theme tokens directly, so changing the theme updates the whole UI consistently.
- The public signup page uses RTK Query while the admin area uses direct Axios calls in most places.
- Several admin screens use the same left sidebar pattern for visual consistency.
- Newsletter previews are rendered in `iframe` elements via `srcDoc`, which is appropriate for isolated HTML preview.
- Backend cookies are required for protected admin routes, so `withCredentials` is enabled wherever needed.

## External Services Used By The Frontend

- The backend API at `https://newsmail-2s5a.onrender.com`
- Google Fonts for typography
- DaisyUI for theme system
- Recharts for dashboard charts
- ExcelJS and FileSaver for spreadsheet export workflows

## How To Run The Frontend

1. Install dependencies inside `frontend`
2. Make sure the backend URL in the utility and API files points to a reachable server
3. Start the dev server with `npm run dev`
4. Open the Vite URL in the browser

## Quick Route Map

- `/` - public newsletter signup page
- `/settings` - theme customization page
- `/about` - about/creator page
- `/admin` - admin login
- `/admin-dashboard` - admin summary dashboard
- `/admin/articles` - scraped article list
- `/admin/send-mail` - newsletter dispatch page
- `/admin/newsLetter` - newsletter archive page
- `/admin/scrape` - scraping and AI generation page

## Summary

The frontend is a polished React dashboard and landing experience for NewsMail. It manages public newsletter subscriptions, theme selection, admin authentication, article scraping, newsletter generation, newsletter previewing, and bulk dispatch. The architecture is intentionally split between public pages, global shell components, protected admin screens, and lightweight state management for theme and newsletter signup.
