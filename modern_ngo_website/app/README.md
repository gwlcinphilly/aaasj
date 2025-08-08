# AAASJ Website

A modern Next.js website for the AAASJ organization.

## Prerequisites

- Node.js 18+ 
- Yarn or npm
- PostgreSQL (for database)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd modern_ngo_website/app
```

2. Install dependencies:
```bash
yarn install
# or
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:
- Update `DATABASE_URL` with your PostgreSQL connection string
- Set `NEXTAUTH_SECRET` to a secure random string
- Configure other environment variables as needed

4. Set up the database:
```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma db push
```

## Development

Start the development server:
```bash
yarn dev
# or
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `yarn dev` - Start development server
- `yarn build` - Build for production
- `yarn start` - Start production server
- `yarn lint` - Run ESLint

## Environment Variables

See `.env.example` for all available environment variables.

## Database

This project uses Prisma with PostgreSQL. Make sure to:
1. Set up a PostgreSQL database
2. Update the `DATABASE_URL` in your environment file
3. Run `npx prisma db push` to apply the schema

## Deployment

The application is configured for deployment with:
- Next.js standalone output
- Environment variable configuration
- Database migrations via Prisma

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request
