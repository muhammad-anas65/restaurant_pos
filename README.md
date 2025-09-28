# Restaurant POS System MVP

A modern, full-featured Restaurant Point of Sale (POS) system built with React.js, Node.js, Express, and MySQL. Designed for efficiency and ease of use in restaurant environments.

## 🚀 Features

### Core Functionality
- **User Management**: Admin and Cashier roles with JWT authentication
- **Menu Management**: Full CRUD operations for menu items with categories
- **Order Processing**: Complete order lifecycle from creation to payment
- **Table Management**: Real-time table status and assignment
- **Payment Processing**: Support for cash and card payments with change calculation
- **Sales Reporting**: Daily sales analytics and insights

### User Interface
- **Modern Design**: Clean, professional interface optimized for touch devices
- **Responsive Layout**: Works seamlessly on tablets, phones, and desktops
- **Real-time Updates**: Live order status and table availability
- **Intuitive Navigation**: Role-based menus and quick access controls

## 🛠 Technology Stack

- **Frontend**: React.js, TypeScript, Tailwind CSS, Vite
- **Backend**: Node.js, Express.js, JWT Authentication
- **Database**: MySQL 8.0
- **Containerization**: Docker & Docker Compose
- **Security**: bcrypt password hashing, rate limiting, input validation

## 📋 Prerequisites

- **Docker & Docker Compose** (recommended)
- **OR Manual Setup**:
  - Node.js 18+
  - MySQL 8.0+
  - npm or yarn

## 🚀 Quick Start with Docker

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd restaurant-pos-system
   ```

2. **Start the application**
   ```bash
   docker-compose up -d
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001/api
   - MySQL: localhost:3306

4. **Login credentials**
   - **Admin**: `admin` / `admin123`
   - **Cashier**: `cashier` / `cashier123`

## 🔧 Manual Installation

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

4. **Set up database**
   ```bash
   # Create database and run migrations
   mysql -u root -p < ../database/init.sql
   mysql -u root -p < ../database/seed.sql
   ```

5. **Start backend server**
   ```bash
   npm run dev
   ```

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   # Create .env file
   echo "VITE_API_URL=http://localhost:3001/api" > .env
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

## 📊 Database Schema

The system uses 6 core tables:

- **users**: Authentication and role management
- **tables**: Restaurant table management
- **menu_items**: Food and beverage catalog
- **orders**: Order tracking and status
- **order_items**: Order line items
- **payments**: Payment processing and records

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Menu Management (Admin)
- `GET /api/menu` - Get all menu items
- `POST /api/menu` - Create menu item
- `PUT /api/menu/:id` - Update menu item
- `DELETE /api/menu/:id` - Delete menu item

### Orders
- `GET /api/orders` - Get orders
- `POST /api/orders` - Create order
- `GET /api/orders/:id` - Get order details
- `POST /api/orders/:id/payment` - Process payment

### Tables
- `GET /api/tables` - Get all tables
- `POST /api/tables` - Create table (Admin)
- `PUT /api/tables/:id` - Update table (Admin)

### Reports (Admin)
- `GET /api/reports/daily` - Daily sales report
- `GET /api/reports/monthly` - Monthly sales report

## 👥 User Roles

### Admin
- Full menu management (create, edit, delete items)
- View comprehensive sales reports
- Manage tables and seating arrangements
- Process orders and payments

### Cashier/Waiter
- Take and manage orders
- Process payments
- View table status
- Access order history

## 🎨 UI Components

### Key Screens
1. **Login Screen**: Secure authentication with demo credentials
2. **Dashboard**: Overview of daily operations and stats
3. **Order Management**: Create orders, view status, process payments
4. **Table Management**: Visual table layout and status
5. **Menu Management**: Admin interface for menu editing
6. **Reports**: Sales analytics and insights

### Design Features
- **Color System**: Professional blue/green palette with status indicators
- **Typography**: Clear, readable fonts optimized for point-of-sale use
- **Animations**: Smooth transitions and hover effects
- **Mobile First**: Touch-friendly interface for tablets and phones

## 🔧 Configuration

### Environment Variables

**Backend (.env)**
```env
PORT=3001
NODE_ENV=development
DB_HOST=localhost
DB_PORT=3306
DB_USER=pos_user
DB_PASSWORD=pos_password
DB_NAME=restaurant_pos
JWT_SECRET=your-secret-key
FRONTEND_URL=http://localhost:3000
```

**Frontend (.env)**
```env
VITE_API_URL=http://localhost:3001/api
```

## 🚀 Deployment

### Production Build
```bash
# Backend
cd backend
npm run start

# Frontend
cd frontend
npm run build
npm run preview
```

### Docker Production
```bash
docker-compose -f docker-compose.yml up -d
```

## 📈 Future Enhancements

### Planned Features
- **Inventory Management**: Stock tracking and low-stock alerts
- **Employee Time Tracking**: Clock in/out functionality
- **Customer Management**: Loyalty programs and customer data
- **Advanced Reporting**: Profit margins, staff performance
- **Multi-location Support**: Chain restaurant management
- **Kitchen Display System**: Order preparation workflow
- **Receipt Printing**: Thermal printer integration

### Technical Improvements
- **Real-time Updates**: WebSocket integration
- **Offline Mode**: PWA capabilities for network outages
- **Data Export**: CSV/PDF report generation
- **Backup System**: Automated database backups
- **Advanced Security**: 2FA, audit logging

## 🛟 Support & Troubleshooting

### Common Issues

**Database Connection Error**
```bash
# Check MySQL is running
docker ps
# Restart services
docker-compose restart
```

**Port Already in Use**
```bash
# Change ports in docker-compose.yml or .env
# Kill existing processes
lsof -ti:3001 | xargs kill
```

**Build Errors**
```bash
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📄 License

MIT License - feel free to use this project for commercial or personal use.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📞 Contact

For questions, feature requests, or support, please open an issue on the GitHub repository.

---

**Built with ❤️ for the restaurant industry**