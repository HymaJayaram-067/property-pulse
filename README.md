# Property Pulse 🏡

> AI-Powered Real Estate Platform - Find your dream property with intelligent search

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue)](https://www.typescriptlang.org/)

Property Pulse is a modern, full-stack real estate platform that leverages AI to revolutionize property search and listing management. Built with React, Node.js, and Grok AI, it offers natural language search, automated property descriptions, and intelligent recommendations.

![Property Pulse Banner](https://via.placeholder.com/1200x400/0ea5e9/ffffff?text=Property+Pulse+-+AI-Powered+Real+Estate)

## ✨ Features

### 🤖 AI-Powered Features
- **Natural Language Search**: Search properties using conversational queries like "Find me a 3-bedroom house near downtown under $500k"
- **AI-Generated Descriptions**: Automatically generate compelling property descriptions
- **Smart Recommendations**: Get personalized property suggestions based on preferences

### 🏠 Property Management
- **Full CRUD Operations**: Create, read, update, and delete property listings
- **Image Gallery**: Upload up to 10 high-quality images per property
- **Advanced Filtering**: Filter by price, bedrooms, bathrooms, location, and property type
- **Real-time Status**: Track properties as for-sale, sold, or rented

### 👤 User Features
- **Secure Authentication**: JWT-based authentication with password hashing
- **Favorites System**: Save and manage favorite properties
- **User Dashboard**: Centralized control panel for listings and favorites
- **My Listings**: Manage your own property listings

### 🎨 Modern UI/UX
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Tailwind CSS**: Beautiful, modern interface
- **Loading States**: Smooth user experience with proper feedback
- **Image Galleries**: Interactive property image viewers

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI library
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool
- **React Router v6** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client
- **React Hook Form** - Form management
- **React Icons** - Icon library

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **TypeScript** - Type safety
- **MongoDB & Mongoose** - Database and ODM
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Grok AI API** - AI features
- **Cloudinary** - Image hosting
- **Multer** - File uploads
- **Express Validator** - Input validation

## 📋 Prerequisites

Before you begin, ensure you have:
- Node.js (v18 or higher)
- npm or yarn
- MongoDB (local or MongoDB Atlas account)
- Cloudinary account
- Grok AI API key

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/property-pulse.git
cd property-pulse
```

### 2. Install Dependencies

```bash
# Install all dependencies (root, client, and server)
npm run install:all
```

### 3. Configure Environment Variables

#### Server (.env)
```bash
cd server
cp .env.example .env
```

Edit `server/.env`:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key_min_32_characters
GROK_API_KEY=your_grok_api_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
NODE_ENV=development
```

#### Client (.env)
```bash
cd ../client
cp .env.example .env
```

Edit `client/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Run the Application

From the root directory:

```bash
# Run both client and server
npm run dev
```

Or run separately:

```bash
# Terminal 1 - Server
cd server
npm run dev

# Terminal 2 - Client
cd client
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 📁 Project Structure

```
property-pulse/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── auth/      # Authentication components
│   │   │   ├── common/    # Shared components
│   │   │   ├── properties/# Property components
│   │   │   └── favorites/ # Favorites components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   ├── context/       # React Context
│   │   ├── hooks/         # Custom hooks
│   │   ├── types/         # TypeScript types
│   │   └── utils/         # Utility functions
│   └── package.json
├── server/                # Node.js backend
│   ├── src/
│   │   ├── controllers/   # Route controllers
│   │   ├── models/        # Database models
│   │   ├── routes/        # API routes
│   │   ├── middleware/    # Custom middleware
│   │   ├── services/      # Business logic
│   │   ├── config/        # Configuration
│   │   ├── types/         # TypeScript types
│   │   └── utils/         # Utility functions
│   └── package.json
├── docs/                  # Documentation
│   ├── SETUP.md          # Setup guide
│   ├── API.md            # API documentation
│   └── DEPLOYMENT.md     # Deployment guide
├── .gitignore
├── package.json          # Root package.json
└── README.md
```

## 📚 Documentation

- [Setup Guide](./docs/SETUP.md) - Detailed setup instructions
- [API Documentation](./docs/API.md) - Complete API reference
- [Deployment Guide](./docs/DEPLOYMENT.md) - Production deployment

## 🔑 Key Features Explained

### AI-Powered Search

Use natural language to find properties:
```
"Show me 3-bedroom apartments in San Francisco under $800k"
"Houses with at least 2 bathrooms near downtown"
"Modern condos in California between $500k and $1M"
```

### Property Listing Creation

1. Navigate to Dashboard
2. Click "Create New Listing"
3. Fill in property details
4. Upload images (up to 10)
5. Use AI to generate description (optional)
6. Submit

### Favorites Management

- Click heart icon on any property card
- Access all favorites from the "Favorites" page
- Remove from favorites anytime

## 🧪 Testing

### Backend Testing

```bash
cd server
npm test
```

### Frontend Testing

```bash
cd client
npm test
```

## 🏗️ Building for Production

### Build Backend

```bash
cd server
npm run build
```

### Build Frontend

```bash
cd client
npm run build
```

## 🚢 Deployment

See [DEPLOYMENT.md](./docs/DEPLOYMENT.md) for detailed deployment instructions.

Quick deployment options:
- **Backend**: Render, Heroku, Railway
- **Frontend**: Vercel, Netlify
- **Database**: MongoDB Atlas
- **Images**: Cloudinary

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Grok AI for the GPT API
- Cloudinary for image hosting
- MongoDB Atlas for database hosting
- The open-source community

## 📧 Contact

For questions or support, please open an issue on GitHub.

## 🗺️ Roadmap

- [ ] Property comparison feature
- [ ] Advanced search with map integration
- [ ] Email notifications
- [ ] Property viewing scheduling
- [ ] Chat messaging between buyers and sellers
- [ ] Mobile app (React Native)
- [ ] Virtual property tours
- [ ] Price prediction using ML

## 📊 Screenshots

### Home Page
![Home Page](https://via.placeholder.com/800x500/0ea5e9/ffffff?text=Home+Page)

### Property Listing
![Property Listing](https://via.placeholder.com/800x500/0ea5e9/ffffff?text=Property+Listing)

### AI Search
![AI Search](https://via.placeholder.com/800x500/0ea5e9/ffffff?text=AI+Search)

### Dashboard
![Dashboard](https://via.placeholder.com/800x500/0ea5e9/ffffff?text=Dashboard)

---

Made with ❤️ by the Property Pulse Team
