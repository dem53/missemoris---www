# MissEmoris

MissEmoris is a full-stack e-commerce web application that allows users to browse products, add them to cart, manage favorites, and complete purchases through various payment methods including credit card and bank transfer.

## Project Overview

This project consists of a React frontend and Node.js/Express backend with MongoDB as the database. It includes user authentication, product management, shopping cart functionality, order processing, and payment integration with Iyzipay.

## Features

- **User Authentication**: Register, login, and user profile management
- **Product Catalog**: Browse and search products
- **Shopping Cart**: Add, remove, and update items in cart
- **Favorites**: Save products to favorites list
- **Order Management**: Place and track orders
- **Payment Processing**: 
  - Credit card payments via Iyzipay integration
  - Bank transfer option (Havale)
- **Subscription System**: Newsletter subscription functionality
- **Responsive Design**: Mobile-friendly interface
- **API Documentation**: Swagger UI for API documentation

## Tech Stack

### Frontend
- React.js (v19)
- React Router for navigation
- Axios for API requests
- Tailwind CSS for styling
- Framer Motion for animations
- React Toastify for notifications
- JWT for authentication

### Backend
- Node.js with Express
- MongoDB with Mongoose for database
- JWT for authentication
- Multer for file uploads
- Bcrypt for password hashing
- Swagger for API documentation
- Iyzipay for payment processing
- CORS for cross-origin resource sharing

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Backend Setup
1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the backend directory with the following variables:
   ```
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   IYZIPAY_API_KEY=your_iyzipay_api_key
   IYZIPAY_SECRET_KEY=your_iyzipay_secret_key
   ```

4. Start the backend server:
   ```
   npm start
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the frontend development server:
   ```
   npm start
   ```

## Usage

- Access the web application at `http://localhost:3000`
- Access the API documentation at `http://localhost:5000/api/docs`

## API Endpoints

The API includes endpoints for:
- Authentication (register, login)
- Products (list, details, search)
- Cart management
- Order processing
- Payment handling
- User favorites
- Subscriptions

For detailed API documentation, visit the Swagger UI at `/api/docs` when the backend server is running.

## Deployment

The application can be deployed using various platforms:
- Frontend: Vercel, Netlify, or any static hosting service
- Backend: Heroku, AWS, DigitalOcean, or any Node.js hosting service
- Database: MongoDB Atlas or any MongoDB hosting service

## License

This project is licensed under the ISC License.

## Contact

For any inquiries, please reach out to the project maintainers. 