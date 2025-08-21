# Overview

BrainBridge is a comprehensive job matching platform designed to connect neurodivergent professionals with inclusive employers. The platform features AI-powered job matching, user profile management, certification systems, and comprehensive dashboards for different user types (ND Adults, Employers, Admins). Built as a full-stack application with React frontend and Python/FastAPI backend, it emphasizes accessibility, user experience, and meaningful employment connections.

## Recent Changes

### Modular Self-Discovery Assessment System Completed (August 20, 2025)
- ✓ Implemented 6 modular assessment components for separate cognitive categories
- ✓ Built reusable QuestionForm and AssessmentCard components to eliminate code duplication
- ✓ Created comprehensive question sets for each of 12 Cognitive Demand Categories (CDC)
- ✓ Established clean architecture with proper separation of concerns
- ✓ Assessment system fully functional with scenario-based questions avoiding clinical language

### Backend Migration to FastAPI Completed (August 19, 2025)
- ✓ Successfully migrated backend from Node.js/Express to Python/FastAPI
- ✓ FastAPI server running on port 5000 with authentication endpoints
- ✓ SQLAlchemy ORM with PostgreSQL database integration
- ✓ JWT-based authentication system implemented
- ✓ All API routes structured for scalable development

# User Preferences

Preferred communication style: Simple, everyday language.
UI Preference: Single unified forms instead of tabbed interfaces for better user experience.
Code Organization: Prefer separate CSS files for components to eliminate repetition and improve maintainability.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **Styling**: Tailwind CSS with shadcn/ui component library for consistent design system, organized with component-specific CSS files to eliminate repetition
- **CSS Organization**: Separate CSS files for components (header.css, stats-card.css, etc.) and pages (dashboard-common.css, profile-management.css) to improve maintainability
- **State Management**: TanStack Query (React Query) for server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **Forms**: React Hook Form with Zod validation for type-safe form handling
- **UI Components**: Radix UI primitives wrapped with shadcn/ui for accessibility and consistency

## Backend Architecture
- **Runtime**: Python 3.11 with FastAPI framework
- **Language**: Python with Pydantic for data validation
- **Database ORM**: SQLAlchemy with PostgreSQL
- **Authentication**: JWT-based authentication with passlib
- **Session Management**: Stateless JWT tokens
- **File Uploads**: FastAPI multipart support with planned Google Cloud Storage integration

## Database Design
- **Database**: PostgreSQL (via Neon serverless)
- **Schema Management**: SQLAlchemy models with automatic table creation
- **Key Tables**:
  - Users with role-based access (ND_Adult, Employer, Admin, Manager)
  - Profiles for neurodivergent adults with traits and strengths
  - Job postings with employment type and requirements
  - Job matching system with AI-powered reasoning
  - Support relationships and audit logging
- **Enums**: Strongly typed enums for user roles, employment types, experience levels, and availability status

## Authentication & Authorization
- **Provider**: Replit OpenID Connect integration
- **Session Storage**: PostgreSQL-backed sessions with configurable TTL
- **Role-Based Access**: Multi-role system with route-level protection
- **Security**: HTTP-only cookies, secure sessions, CSRF protection

## File Storage & Media
- **Provider**: Google Cloud Storage for profile images and documents
- **Upload Interface**: Uppy dashboard for drag-drop file uploads
- **Integration**: Direct cloud storage with signed URLs for secure access

## API Architecture
- **Design**: RESTful API with consistent error handling
- **Validation**: Zod schemas for request/response validation
- **Error Handling**: Centralized error middleware with structured responses
- **Logging**: Request/response logging with performance metrics

## Development Environment
- **Hot Reload**: Vite HMR for frontend, tsx watch mode for backend
- **Type Safety**: Full TypeScript coverage with strict configuration
- **Path Aliases**: Configured aliases for clean imports (@/, @shared/, @assets/)
- **Development Tools**: Replit-specific plugins for cartographer and error overlays

## Deployment Architecture
- **Build Process**: Vite for frontend bundling, esbuild for backend compilation
- **Static Assets**: Served from dist/public directory
- **Environment**: Production-ready with environment variable configuration
- **Database**: Neon PostgreSQL with connection pooling

# External Dependencies

## Core Infrastructure
- **Database**: Neon PostgreSQL serverless database
- **Authentication**: Replit OpenID Connect provider
- **File Storage**: Google Cloud Storage for media and documents
- **WebSocket**: WebSocket support for real-time features

## Key Libraries
- **Frontend**: React, TanStack Query, Tailwind CSS, shadcn/ui, Wouter, React Hook Form, Zod
- **Backend**: FastAPI, SQLAlchemy, Pydantic, JWT authentication, Uvicorn
- **File Handling**: Uppy with AWS S3 and Google Cloud Storage adapters
- **UI Components**: Radix UI primitives for accessibility
- **Development**: Vite, TypeScript, tsx, esbuild

## Third-Party Services
- **Session Storage**: connect-pg-simple for PostgreSQL session store
- **Validation**: Zod for schema validation across frontend and backend
- **Icons**: Lucide React for consistent iconography
- **Fonts**: Google Fonts integration (Inter, DM Sans, Fira Code, Geist Mono)