# Portfolio Tracker

A modern, vibe coded, full-stack portfolio management application built with **Next.js 16**, **Tailwind CSS**, and **MongoDB**. This project was created so that I can manage my investments properly and get a clear overview of my financial status.

## Features

- **Interactive Dashboard**: Visualize your portfolio allocation and performance history using Recharts.
- **Holdings Management**: Track individual assets, their current value, and risk levels.
- **Transaction Ledger**: Maintain a complete history of buy/sell activities with categorized entries.
- **Secure Authentication**: Built-in user registration and login powered by NextAuth.js and bcrypt encryption.
- **Responsive Design**: A sleek, dark-themed UI that works beautifully on all devices.
- **Developer Friendly**: Pre-configured with Husky, Lint-staged, and Commitlint for high code quality.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
- **Authentication**: [Next-auth](https://next-auth.js.org/)
- **Charts**: [Recharts](https://recharts.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB instance (Local or Atlas)
- Docker (Optional, for containerized development)

### Local Development

1. **Clone the repository**:

   ```bash
   git clone <repository-url>
   cd portfolio-tracker
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Set up Environment Variables**:
   Create a `.env.local` file in the root directory and add:

   ```env
   MONGODB_URI=your_mongodb_connection_string
   NEXTAUTH_SECRET=your_nextauth_secret
   NEXTAUTH_URL=http://localhost:3000
   ```

4. **Run the development server**:

   ```bash
   npm run dev
   ```

5. **Open the app**:
   Navigate to [http://localhost:3000](http://localhost:3000).

### Using Docker

If you prefer using Docker for development:

```bash
docker-compose up --build
```

## 📁 Project Structure

- `src/app`: Next.js App Router pages and API routes.
- `src/components`: Reusable UI components (Charts, Cards, Forms).
- `src/models`: Mongoose schemas for Users, Holdings, and Transactions.
- `src/lib`: Shared utility functions and constants.
- `public`: Static assets like images and icons.

## 📝 Available Scripts

- `npm run dev`: Starts the development server.
- `npm run build`: Builds the application for production.
- `npm run start`: Starts the production server.
- `npm run lint`: Runs ESLint for code quality checks.
- `npm run type-check`: Validates TypeScript types.
- `npm run format`: Formats code using Prettier.
