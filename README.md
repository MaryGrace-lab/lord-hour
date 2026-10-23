# The Lord's Hour Ministries — Official Website

A responsive ministry website for **The Lord's Hour Ministries International**, connecting visitors with ministry information, church branches, worship schedules, the School of the Spirit Bible College, and other ministry resources.

**Live Website:** https://thelordshourministry.org

## Overview

The Lord's Hour Ministries website serves as an online information hub for the ministry's community in Nigeria and Italy.

The website introduces the ministry, shares its history and vision, provides worship schedules and branch information, and presents information about its Bible college and other ministry activities.

The interface includes English and Italian language options to support its international audience.

## Features

### Ministry Information
- Homepage introducing the ministry and its mission.
- Ministry history and background.
- Vision, mission, and beliefs navigation.
- Administration and pastoral-message sections.
- Information about ministry branches in Nigeria and Italy.

### Worship and Branch Information
- Church location information.
- Worship service schedules.
- Bible study schedules.
- Prayer meeting schedules.
- Contact information for ministry enquiries.

### School of the Spirit Bible College
- Bible college introduction and programme information.
- Diploma in Ministry.
- Certificate in Biblical Studies.
- Leadership Track.
- Online and on-campus study information.
- Admissions guidance and application entry points.
- Student sign-in entry point.

### Community and Engagement
- Ministry gallery.
- Testimonies section.
- Online giving entry point.
- Contact and enquiry links.
- English and Italian language options.

The availability of individual forms, student features, and giving functionality depends on their implementation and the configuration of their connected services.

## Technology Stack

### Frontend
- **Next.js 16** — React framework and application routing.
- **React 19** — Component-based interface development.
- **TypeScript** — Static typing.
- **Tailwind CSS** — Responsive styling.

### Backend and Data
- **Next.js API Routes** — Backend endpoints.
- **PostgreSQL** — Relational database.
- **Neon** — Hosted PostgreSQL database service.
- **Prisma ORM** — Database access and schema management.
- **JWT** — Token-based authentication where implemented.
- **bcrypt** — Password hashing.
- **Zod** — Data validation.

### Additional Services
- **Upstash Redis** — Redis-based caching or other configured data operations.
- **Resend** — Email delivery.

### Development and Deployment
- Git and GitHub
- Vercel
- Google Search Console

## SEO and Responsiveness

The website is built with a responsive interface intended to support visitors using desktop computers, tablets, and mobile devices.

SEO-related work includes the use of website metadata and Google Search Console for search visibility monitoring. Search indexing and performance should be verified against the live deployment rather than assumed from the presence of these tools.

## Security Considerations

Security-related technologies include authentication, password hashing, and input validation where implemented.

For production environments:
- Store database URLs and authentication secrets in environment variables.
- Do not commit credentials, private keys, or `.env` files.
- Validate form submissions and API inputs on the server.
- Enforce authorization on protected endpoints and student-only resources.
- Protect authentication cookies and session-related data.
- Apply suitable rate limits to login, application, and other sensitive endpoints.
- Verify that giving and email integrations use the correct production configuration.

## Local Development

### Prerequisites

- Node.js version compatible with the project's Next.js version.
- npm or another package manager supported by the repository.
- A configured PostgreSQL database.
- Environment variables required by the application.

### Setup

1. Clone the repository:

   ```bash
   git clone YOUR_REPOSITORY_URL
   cd YOUR_REPOSITORY_DIRECTORY
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a local environment file:

   ```bash
   cp .env.example .env
   ```

   If no `.env.example` exists, use the actual environment-variable names referenced by the application to create a local `.env` file.

4. Configure the database connection and any required authentication, email, or Redis credentials.

5. Run the database setup commands defined by the project's Prisma configuration and package scripts.

6. Start the development server using the configured development script. For a standard Next.js project:

   ```bash
   npm run dev
   ```

7. Visit http://localhost:3000.

### Production Build

For a standard Next.js setup:

```bash
npm run build
```

Run the production server using the script configured in `package.json`, commonly:

```bash
npm run start
```

Use the actual repository scripts and deployment configuration if they differ from these defaults.

## Deployment

**Live Website:** https://thelordshourministry.org

The project uses Vercel for deployment and Google Search Console for search visibility monitoring.

## Project Purpose

This project demonstrates the development of a ministry website that combines public-facing information, branch and worship schedules, educational programme information, and digital access to ministry resources.

## Developer

**Mary Umoize**  
GitHub: https://github.com/MaryGrace-lab

## Acknowledgements

Developed for The Lord's Hour Ministries International.

**Live Website:** https://thelordshourministry.org
