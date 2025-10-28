# E-Commerce Sales Dashboard

A full-stack web application for visualizing e-commerce sales data with interactive charts, date-range filters, and CSV export functionality.

## Tech Stack

### Backend
- **Java 17** with **Spring Boot 3.2.0**
- **Spring Security** with **JWT Authentication**
- **Spring Data JPA** with **MySQL** database
- **Role-Based Access Control (RBAC)**
- **OpenCSV** for CSV export
- **Maven** for dependency management
- **JUnit** for unit testing

### Frontend
- **React 18** with **Vite**
- **React Router** for navigation
- **Recharts** for data visualization
- **Axios** for API calls
- **date-fns** for date manipulation
- Responsive design with custom CSS

## Features

### Authentication & Authorization
- JWT-based authentication
- Role-based access control (ADMIN, USER)
- Protected routes and API endpoints
- Secure password encryption with BCrypt

### Sales Analytics Dashboard
- **Interactive Charts:**
  - Line chart for sales trends over time
  - Pie chart for revenue distribution by category
  - Bar chart for regional sales comparison
- **Date Range Filters:** Filter sales data by custom date ranges
- **Pagination:** Efficient data loading with paginated APIs
- **Real-time Statistics:** Total revenue, total sales, and average order value
- **Sales Table:** Detailed view of recent transactions

### CSV Export
- Export filtered sales data to CSV format
- Admin-only feature with role-based access control
- Timestamped filename for easy organization

### Sample Data
- Auto-generated sample products and sales data
- Demo user accounts (admin and regular user)

## Project Structure

```
ecommerce-dashboard/
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/ecommerce/dashboard/
│   │   │   │   ├── config/          # Security configuration
│   │   │   │   ├── controller/      # REST API controllers
│   │   │   │   ├── dto/             # Data Transfer Objects
│   │   │   │   ├── entity/          # JPA entities
│   │   │   │   ├── repository/      # Database repositories
│   │   │   │   ├── security/        # JWT and security classes
│   │   │   │   └── service/         # Business logic
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   └── test/                    # Unit tests
│   └── pom.xml
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/                 # Auth context
│   │   ├── pages/                   # Login & Dashboard
│   │   ├── services/                # API service
│   │   └── App.jsx
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## Prerequisites

- **Java 17** or higher
- **Maven 3.6+**
- **Node.js 18+** and **npm**
- **MySQL 8.0+**

## Setup Instructions

### 1. Database Setup

```bash
# Start MySQL service
sudo systemctl start mysql

# Create database (or let Spring Boot create it automatically)
mysql -u root -p
CREATE DATABASE ecommerce_dashboard;
```

### 2. Backend Setup

```bash
cd backend

# Update MySQL credentials if needed
# Edit src/main/resources/application.properties
# Set your MySQL username and password

# Build the project
mvn clean install

# Run the application
mvn spring-boot:run
```

The backend server will start on `http://localhost:8080`

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will start on `http://localhost:5173`

## Demo Credentials

### Admin User
- **Username:** `admin`
- **Password:** `admin123`
- **Permissions:** Full access including CSV export

### Regular User
- **Username:** `user`
- **Password:** `user123`
- **Permissions:** View dashboard and sales data

## API Endpoints

### Authentication
- `POST /api/auth/signin` - User login
- `POST /api/auth/signup` - User registration

### Sales
- `GET /api/sales` - Get paginated sales data (requires authentication)
  - Query params: `startDate`, `endDate`, `page`, `size`, `sortBy`, `sortDir`
- `GET /api/sales/export` - Export sales to CSV (admin only)
  - Query params: `startDate`, `endDate`

## Running Tests

### Backend Tests
```bash
cd backend
mvn test
```

### Build for Production

#### Backend
```bash
cd backend
mvn clean package
java -jar target/dashboard-backend-1.0.0.jar
```

#### Frontend
```bash
cd frontend
npm run build
# The build output will be in the 'dist' folder
```

## Features Demonstrated

✅ **Full-stack architecture** with React frontend and Spring Boot backend
✅ **JWT authentication** with token-based security
✅ **Role-based access control** (RBAC) with Spring Security
✅ **RESTful API design** with proper HTTP methods and status codes
✅ **Database modeling** with JPA entities and relationships
✅ **Interactive data visualization** with Recharts library
✅ **Responsive UI design** with modern CSS
✅ **Pagination** for efficient data handling
✅ **CSV export functionality** with role-based restrictions
✅ **Unit tests** with JUnit and MockMvc
✅ **CI/CD configuration** with GitHub Actions

## Development Notes

- The application uses JWT tokens stored in localStorage
- CORS is configured to allow requests from `http://localhost:3000` and `http://localhost:5173`
- Sample data is automatically generated on first run
- MySQL connection uses `createDatabaseIfNotExist=true` for convenience

## Future Enhancements

- Real-time updates with WebSockets
- Advanced analytics and forecasting
- Email reports and scheduled exports
- Product inventory management
- Customer relationship management (CRM) features

## License

This project is created for portfolio demonstration purposes.

---

**Author:** Abhay Kandpal
**Contact:** abhaykandpal82@gmail.com
