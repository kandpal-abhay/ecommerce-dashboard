# E-Commerce Sales Dashboard - Project Summary

## Project Overview
A production-ready full-stack web application demonstrating modern software development practices with React frontend and Spring Boot backend. This project showcases JWT authentication, role-based access control, interactive data visualization, and CSV export functionality.

## Technology Stack

### Backend
- **Framework:** Spring Boot 3.2.0 (Java 17)
- **Security:** Spring Security with JWT authentication
- **Database:** MySQL 8.0+ with Spring Data JPA
- **Additional Libraries:** OpenCSV, Lombok, JJWT

### Frontend
- **Framework:** React 18 with Vite
- **Routing:** React Router v6
- **Charts:** Recharts
- **HTTP Client:** Axios
- **Date Handling:** date-fns

## Key Features Implemented

### 1. Authentication & Security
- ✅ JWT-based authentication system
- ✅ Role-based access control (ADMIN, USER)
- ✅ Protected API endpoints
- ✅ Secure password encryption with BCrypt
- ✅ Token-based session management

### 2. Sales Analytics Dashboard
- ✅ Interactive line chart for sales trends
- ✅ Pie chart for category distribution
- ✅ Bar chart for regional analysis
- ✅ Real-time statistics cards
- ✅ Detailed sales table with recent transactions

### 3. Data Management
- ✅ Date range filtering
- ✅ Pagination support
- ✅ Sorting capabilities
- ✅ CSV export (admin-only)
- ✅ Sample data auto-generation

### 4. User Interface
- ✅ Responsive design
- ✅ Modern, clean UI
- ✅ Loading states
- ✅ Error handling
- ✅ Form validation

## Project Structure

```
ecommerce-dashboard/
├── backend/                           # Spring Boot Application
│   ├── src/main/java/com/ecommerce/dashboard/
│   │   ├── config/
│   │   │   └── SecurityConfig.java   # Security configuration
│   │   ├── controller/
│   │   │   ├── AuthController.java   # Authentication endpoints
│   │   │   └── SaleController.java   # Sales API endpoints
│   │   ├── dto/
│   │   │   ├── LoginRequest.java
│   │   │   ├── SignupRequest.java
│   │   │   ├── JwtResponse.java
│   │   │   ├── MessageResponse.java
│   │   │   └── SaleDTO.java
│   │   ├── entity/
│   │   │   ├── User.java             # User entity
│   │   │   ├── Role.java             # Role entity
│   │   │   ├── Product.java          # Product entity
│   │   │   └── Sale.java             # Sale entity
│   │   ├── repository/
│   │   │   ├── UserRepository.java
│   │   │   ├── RoleRepository.java
│   │   │   ├── ProductRepository.java
│   │   │   └── SaleRepository.java
│   │   ├── security/
│   │   │   ├── JwtUtils.java         # JWT token utilities
│   │   │   ├── UserDetailsImpl.java
│   │   │   ├── UserDetailsServiceImpl.java
│   │   │   ├── AuthTokenFilter.java  # JWT filter
│   │   │   └── AuthEntryPointJwt.java
│   │   ├── service/
│   │   │   ├── SaleService.java      # Business logic
│   │   │   └── DataInitializerService.java
│   │   └── DashboardApplication.java # Main application
│   ├── src/test/java/
│   │   └── controller/
│   │       └── AuthControllerTest.java
│   └── pom.xml
├── frontend/                          # React Application
│   ├── src/
│   │   ├── context/
│   │   │   └── AuthContext.jsx       # Auth state management
│   │   ├── pages/
│   │   │   ├── Login.jsx             # Login page
│   │   │   ├── Login.css
│   │   │   ├── Dashboard.jsx         # Dashboard page
│   │   │   └── Dashboard.css
│   │   ├── services/
│   │   │   └── api.js                # API service layer
│   │   ├── App.jsx                   # Main app component
│   │   └── main.jsx                  # Entry point
│   └── package.json
├── .github/workflows/
│   └── ci.yml                         # GitHub Actions CI/CD
├── README.md                          # Comprehensive documentation
├── PROJECT_SUMMARY.md                 # This file
├── start-backend.sh                   # Backend startup script
└── start-frontend.sh                  # Frontend startup script
```

## API Endpoints

### Authentication APIs
- `POST /api/auth/signin` - User login (returns JWT token)
- `POST /api/auth/signup` - User registration

### Sales APIs (Protected)
- `GET /api/sales` - Get paginated sales data
  - Supports filters: `startDate`, `endDate`, `page`, `size`, `sortBy`, `sortDir`
- `GET /api/sales/export` - Export to CSV (Admin only)

## Database Schema

### Tables
1. **users** - User accounts
2. **roles** - Available roles (USER, ADMIN)
3. **user_roles** - Many-to-many relationship
4. **products** - Product catalog
5. **sales** - Sales transactions

## Demo Accounts

| Username | Password   | Role  | Permissions              |
|----------|-----------|-------|-------------------------|
| admin    | admin123  | ADMIN | Full access + CSV export |
| user     | user123   | USER  | View dashboard only      |

## Setup & Running

### Quick Start
```bash
# Terminal 1 - Start backend
cd ~/Documents/ecommerce-dashboard
./start-backend.sh

# Terminal 2 - Start frontend
cd ~/Documents/ecommerce-dashboard
./start-frontend.sh
```

### Manual Start
```bash
# Backend (http://localhost:8080)
cd backend
mvn spring-boot:run

# Frontend (http://localhost:5173)
cd frontend
npm run dev
```

## Testing

### Backend Tests
```bash
cd backend
mvn test
```

Current test coverage:
- Authentication flow tests
- JWT token validation tests

## CI/CD

GitHub Actions workflow included:
- Backend build and test
- Frontend build
- Runs on push/PR to main/develop branches

## Features Alignment with Resume

This project demonstrates all the features mentioned in your resume:

✅ **E-Commerce Sales Dashboard:**
- Interactive charts for sales analytics ✓
- Date-range filters ✓
- CSV export functionality ✓
- Paginated REST APIs ✓
- Role-based access control ✓
- JWT authentication ✓
- Spring Boot + MySQL backend ✓
- React frontend ✓
- Unit tests ✓
- CI checks ✓

## Performance Optimizations

- Pagination to handle large datasets
- Eager loading for user roles
- Indexed database queries
- React component optimization
- Efficient chart rendering with Recharts

## Security Features

- Password hashing with BCrypt
- JWT token expiration
- CORS configuration
- SQL injection prevention (JPA)
- XSS protection (React)
- Authorization checks on all protected endpoints

## Future Enhancement Ideas

- WebSocket for real-time updates
- Advanced analytics (forecasting, ML predictions)
- Email reports
- Multi-currency support
- Mobile app version
- Docker containerization
- Kubernetes deployment

## Skills Demonstrated

- Full-stack development (React + Spring Boot)
- RESTful API design
- Database modeling and JPA
- Security implementation (JWT, RBAC)
- Modern frontend development
- State management
- Responsive design
- Testing (Unit tests)
- CI/CD setup
- Git version control ready

---

**Created by:** Abhay Kandpal
**Date:** October 2025
**Purpose:** Portfolio project for Mobisy application
**Contact:** abhaykandpal82@gmail.com
