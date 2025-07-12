# Coffee Shop Ordering System

## Overview

This is a full-stack coffee shop ordering system built with React, TypeScript, Express, and PostgreSQL. The application allows customers to browse a menu, add items to their cart, and place orders. It features a modern UI with shadcn/ui components and uses Drizzle ORM for database operations.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **UI Library**: shadcn/ui components based on Radix UI primitives
- **Styling**: Tailwind CSS with a custom coffee shop theme
- **State Management**: React hooks for local state, TanStack Query for server state
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **API Design**: RESTful endpoints following `/api/*` pattern
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Session Management**: Express sessions with PostgreSQL session store
- **Error Handling**: Centralized error middleware

### Project Structure
```
├── client/               # React frontend
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── hooks/        # Custom React hooks
│   │   ├── lib/          # Utility functions and configurations
│   │   └── pages/        # Page components
├── server/               # Express backend
│   ├── index.ts          # Server entry point
│   ├── routes.ts         # API route definitions
│   ├── storage.ts        # Database abstraction layer
│   └── vite.ts           # Vite integration for development
├── shared/               # Shared types and schemas
│   └── schema.ts         # Drizzle database schema
└── migrations/           # Database migrations
```

## Key Components

### Database Schema
- **Menu Items**: Products with name, price, category, description, and image
- **Orders**: Customer orders with contact info, delivery details, and status
- **Order Items**: Line items connecting orders to menu items with quantities and notes

### API Endpoints
- `GET /api/menu` - Retrieve all menu items
- `GET /api/menu/:id` - Get specific menu item
- `POST /api/orders` - Create new order

### Frontend Components
- **Header**: Navigation with cart indicator
- **Hero**: Landing section with call-to-action
- **Menu**: Filterable product grid with categories
- **Cart Sidebar**: Shopping cart with item management
- **Checkout Modal**: Order form with customer details
- **Item Modal**: Product details with customization options
- **Confirmation Modal**: Order success feedback

### State Management
- **Cart State**: Local state using custom `useCart` hook
- **Server State**: TanStack Query for API data fetching and caching
- **Form State**: React Hook Form for form validation and submission

## Data Flow

1. **Menu Loading**: Frontend fetches menu items from `/api/menu` on page load
2. **Cart Management**: Items added to local state, persisted across page interactions
3. **Order Creation**: Cart contents and customer details sent to `/api/orders`
4. **Order Processing**: Backend validates data, calculates totals, and stores in database
5. **Confirmation**: Success response triggers confirmation modal with order number

## External Dependencies

### Frontend Dependencies
- **UI Components**: Radix UI primitives with shadcn/ui styling
- **Styling**: Tailwind CSS with PostCSS processing
- **Icons**: Lucide React icon library
- **Forms**: React Hook Form with Zod validation
- **HTTP Client**: Built-in fetch API with TanStack Query wrapper
- **Date Handling**: date-fns for date formatting

### Backend Dependencies
- **Database**: Drizzle ORM with PostgreSQL dialect
- **Session Store**: connect-pg-simple for PostgreSQL session storage
- **Validation**: Zod schemas for request validation
- **Development**: tsx for TypeScript execution, esbuild for production builds

### Development Tools
- **Build System**: Vite for frontend, esbuild for backend
- **Type Checking**: TypeScript with strict mode enabled
- **Database Migrations**: Drizzle Kit for schema management
- **Development Server**: Concurrent frontend and backend development

## Deployment Strategy

### Development Environment
- **Frontend**: Vite dev server with HMR
- **Backend**: tsx with file watching for auto-restart
- **Database**: PostgreSQL connection via environment variables
- **Integration**: Vite proxy for API requests during development

### Production Build
- **Frontend**: Static assets built to `dist/public`
- **Backend**: Single bundled file to `dist/index.js`
- **Database**: Migrations applied via `drizzle-kit push`
- **Deployment**: Node.js server serving both API and static files

### Configuration
- **Environment Variables**: `DATABASE_URL` for PostgreSQL connection
- **Session Config**: PostgreSQL-backed sessions for scalability
- **CORS**: Configured for cross-origin requests in development
- **Static Assets**: Express serves built frontend from production bundle

The application uses a storage abstraction layer (`IStorage` interface) that currently has an in-memory implementation for development, but is designed to be easily swapped with the PostgreSQL implementation using Drizzle ORM.