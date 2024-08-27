# Filmweb Cinemas Data Scraper

## Overview

The Filmweb Cinemas Data Scraper is a Node.js application designed to scrape cinema and movie screening data from the Filmweb website. The application uses Puppeteer and JSDOM for web scraping and Prisma for database interactions.

## Features

- Scrapes cinema data including name, city, latitude, longitude, and screenings URL.
- Scrapes movie data including title, year, duration, director, description, main cast, and genres.
- Saves the scraped data into a PostgreSQL database using Prisma ORM.

## Prerequisites

- Node.js
- PostgreSQL

## Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/Biplo12/filmweb-cinemas-data-scraper.git
   cd filmweb-cinemas-data-scraper
   ```

2. Install dependencies:

   ```sh
   npm install
   ```

3. Set up environment variables:
   - Create a `.env.local` or `.env.production` file in the root directory.
   - Add the following environment variables:
     ```env
     NODE_ENV=development | production
     POSTGRES_PRISMA_URL=your_postgres_connection_string
     ```

## Usage

### Running the Application

To start the application, run:

```sh
npm run start
```

### Running the Application

To start the application in watch mode (useful for development), run:

```sh
npm run start:watch
```

### Database Management

#### Resetting the Database

For development:

```sh
npm run prisma-reset-dev
```

For production:

```sh
npm run prisma-reset-prod
```

#### Pushing Database Schema

For development:

```sh
npm run prisma-push-dev
```

For production:

```sh
npm run prisma-push-prod
```

## Contributing

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes.
4. Commit your changes (`git commit -am 'Add new feature'`).
5. Push to the branch (`git push origin feature-branch`).
6. Create a new Pull Request.

## License

This project is licensed under the MIT License.
