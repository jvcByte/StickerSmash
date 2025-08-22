# Mechanic Workshop Management Application - Development Prompt

## Project Overview
Create a comprehensive mechanic workshop management application using **Expo** for React Native that handles all aspects of automotive service business operations with a focus on modularity, scalability, and user experience.

## Core Application Requirements

### 1. User Management & Authentication
- **Multi-role authentication system**: Admin, Manager, Mechanic, Receptionist, Customer
- **User profiles** with role-based permissions and access control
- **Employee attendance tracking** with clock-in/out functionality
- **Customer account management** with vehicle history
- **Company user management** with role assignment capabilities

### 2. Customer & Vehicle Management
- **Customer database** with contact information, service history, and preferences
- **Vehicle registration** with make, model, year, VIN, license plate, and ownership details
- **Customer communication** system for notifications and updates
- **Service history tracking** per vehicle with detailed records
- **Customer portal** for self-service options

### 3. Workshop Operations
- **Job management system** with work order creation, assignment, and tracking
- **Service scheduling** with calendar integration and appointment booking
- **Work progress tracking** with real-time status updates
- **Labor time tracking** per job and technician
- **Quality control checkpoints** and service completion verification

### 4. Inventory & Product Management
- **Parts and product catalog** with detailed specifications and pricing
- **Inventory tracking** with stock levels, reorder points, and supplier information
- **Automatic inventory alerts** for low stock and reorder notifications
- **Product ordering system** with supplier integration
- **Price management** with markup calculations and customer pricing

### 5. Service Request & Complaint Management
- **Service request portal** for customers to book appointments online
- **Complaint tracking system** with severity levels and resolution tracking
- **Feedback collection** and customer satisfaction surveys
- **Service request assignment** to appropriate technicians
- **Communication threads** for each service request

### 6. Financial Management
- **Invoice generation** with detailed service and parts breakdown
- **Payment processing** with multiple payment method support
- **Cost estimation** tools for service quotes
- **Revenue tracking** and financial reporting
- **Customer payment history** and outstanding balance tracking

## Technical Architecture Requirements

### Framework & Platform
- **Expo SDK** (latest stable version) for React Native development
- **Expo Router** for file-based navigation and deep linking
- **Expo Auth Session** for authentication flows
- **Expo Notifications** for push notifications
- **Expo SQLite** or **Expo SecureStore** for local data persistence

### State Management & Data
- **Redux Toolkit** or **Zustand** for global state management
- **React Query/TanStack Query** for server state management and caching
- **AsyncStorage** for local data persistence
- **Form validation** using React Hook Form with Zod schema validation

### UI/UX Architecture
- **Modular component library** with consistent design system
- **NativeBase** or **Gluestack UI** for pre-built components
- **React Native Paper** for Material Design components (alternative)
- **Custom theme system** with light/dark mode support
- **Responsive design** for tablet and phone compatibility

### Backend Integration
- **RESTful API** architecture with proper error handling
- **Real-time updates** using WebSockets or Server-Sent Events
- **File upload** capabilities for vehicle photos and documents
- **Offline functionality** with data synchronization when online
- **API authentication** with JWT tokens and refresh mechanisms

## Detailed Feature Specifications

### Dashboard & Analytics
- **Role-based dashboards** with relevant KPIs and metrics
- **Real-time workshop status** overview
- **Revenue and performance analytics** with charts and graphs
- **Pending tasks and notifications** center
- **Quick action buttons** for common operations

### Customer Features
- **Vehicle service history** with detailed records and photos
- **Appointment booking** with available time slots
- **Service request submission** with photo uploads
- **Real-time job progress tracking** with notifications
- **Invoice viewing and payment** capabilities
- **Complaint submission and tracking** system

### Employee Features
- **Daily task assignment** and work order management
- **Time tracking** with project-specific logging
- **Inventory lookup** and parts ordering
- **Customer communication** tools
- **Performance metrics** and work history

### Administrative Features
- **Employee management** with role assignment and scheduling
- **Inventory management** with supplier integration
- **Financial reporting** and analytics
- **System configuration** and business rule management
- **Data backup and export** capabilities

## Technical Implementation Guidelines

### Project Structure
```
src/
├── components/          # Reusable UI components
├── screens/            # Screen components organized by feature
├── navigation/         # Navigation configuration
├── services/          # API calls and business logic
├── store/             # State management (Redux/Zustand)
├── utils/             # Helper functions and utilities
├── types/             # TypeScript type definitions
├── constants/         # App constants and configuration
└── hooks/             # Custom React hooks
```

### Code Quality & Best Practices
- **TypeScript** for type safety and better developer experience
- **ESLint and Prettier** for code formatting and quality
- **Husky and lint-staged** for pre-commit hooks
- **Component documentation** with Storybook (optional)
- **Unit and integration testing** with Jest and React Native Testing Library

### Performance Optimization
- **Code splitting** and lazy loading for large screens
- **Image optimization** with proper caching strategies
- **Database indexing** for efficient queries
- **Pagination** for large data sets
- **Memory management** for optimal performance

### Security Requirements
- **Role-based access control** with proper authentication
- **Data encryption** for sensitive information
- **Secure API communication** with HTTPS and token validation
- **Input validation** and sanitization
- **Audit logging** for sensitive operations

## Deployment & DevOps

### Development Environment
- **Expo Development Build** for testing native features
- **Expo Preview** for stakeholder reviews
- **Hot reloading** and fast refresh for development efficiency

### Production Deployment
- **Expo Application Services (EAS)** for building and deployment
- **Over-the-air updates** using Expo Updates
- **App store deployment** for iOS and Android
- **Environment configuration** for different deployment stages

### Monitoring & Analytics
- **Crash reporting** with Expo Crashlytics or Sentry
- **Performance monitoring** and user analytics
- **Error tracking** and debugging tools
- **User behavior analytics** for app optimization

## Success Criteria
- **Intuitive user interface** that requires minimal training
- **Fast performance** with smooth animations and quick response times
- **Reliable offline functionality** with proper data synchronization
- **Scalable architecture** that can handle growing business needs
- **Comprehensive reporting** and analytics capabilities
- **Mobile-first design** optimized for field use by mechanics

## Development Phases
1. **Phase 1**: Core authentication, user management, and basic CRUD operations
2. **Phase 2**: Workshop operations, job management, and customer portal
3. **Phase 3**: Inventory management, ordering system, and financial features
4. **Phase 4**: Advanced analytics, reporting, and optimization features
5. **Phase 5**: Integration capabilities and advanced automation

## Additional Considerations
- **Multilingual support** for international workshop chains
- **Integration capabilities** with existing business systems
- **Customizable workflows** for different workshop types
- **Backup and disaster recovery** planning
- **Compliance** with automotive industry standards and data protection regulations

This application should demonstrate enterprise-level architecture while maintaining the flexibility and ease of development that Expo provides, ensuring both current functionality and future scalability.