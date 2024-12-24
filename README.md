# Currency Converter API

A full-stack currency conversion application built with Node.js, Express, MongoDB, and React, using the Frankfurter API for real-time exchange rates.

## Features

- Real-time currency conversion
- Historical exchange rates
- User authentication with JWT
- Conversion history tracking
- Popular currency pairs analytics
- Docker containerization
- TypeScript implementation
- Secure API with helmet

## Prerequisites

- Node.js v18+
- Docker and Docker Compose
- MongoDB (if running locally)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd currency-converter
```

2. Create `.env` file in the root directory:
```env
PORT=5000
MONGODB_URI=mongodb://mongodb:27017/currency_converter
JWT_SECRET=your_generated_jwt_secret
NODE_ENV=development
```

3. Build and run with Docker:
```bash
docker-compose up --build
```

Or run locally:
```bash
# Backend
cd backend
npm install
npm run dev

# Frontend
cd frontend
npm install
npm run dev
```

## API Routes

### Authentication
- `POST /api/auth/register`
  - Body: `{ "email": string, "password": string, "name": string }`
  - Returns: JWT token and user data

- `POST /api/auth/login`
  - Body: `{ "email": string, "password": string }`
  - Returns: JWT token and user data

### Currency Conversion
All routes require authentication (Bearer token)

- `GET /api/conversions/currencies`
  - Returns: List of supported currencies

- `POST /api/conversions/convert`
  - Body: `{ "amount": number, "fromCurrency": string, "toCurrency": string }`
  - Returns: Conversion result and saves to history

- `GET /api/conversions/history`
  - Returns: User's conversion history (last 10 conversions)

- `GET /api/conversions/historical-rates`
  - Query: `?from=USD&to=EUR&startDate=2024-01-01`
  - Returns: Historical exchange rates

- `GET /api/conversions/popular`
  - Returns: Top 5 most popular currency pairs

## Authentication

Include the JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## Error Handling

The API uses standardized error responses:
```json
{
  "status": "error",
  "message": "Error description",
  "errors": [] // Optional validation errors
}
```

## Development

### Running Tests
```bash
npm test
```

### Code Linting
```bash
npm run lint
```

## Docker Support

The application includes three containers:
- Frontend (React)
- Backend (Node.js/Express)
- MongoDB

To run with Docker:
```bash
# Development
docker-compose up

# Production
docker-compose -f docker-compose.prod.yml up
```

## Security

- JWT authentication
- Password hashing with bcrypt
- Request validation with Zod
- Security headers with helmet
- CORS protection
- Rate limiting
- Input sanitization