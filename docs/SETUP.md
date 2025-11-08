# Property Pulse - Setup Guide

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18 or higher)
- npm or yarn
- MongoDB (local or MongoDB Atlas account)
- Cloudinary account (for image uploads)
- Grok API key (for AI features)

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd property-pulse
```

### 2. Install Dependencies

Install all dependencies for the monorepo:

```bash
npm run install:all
```

Or install individually:

```bash
# Install root dependencies
npm install

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 3. Environment Configuration

#### Server Environment Variables

Create a `.env` file in the `server` directory:

```bash
cd server
cp .env.example .env
```

Edit the `.env` file with your credentials:

```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/property-pulse
JWT_SECRET=your_secure_jwt_secret_key_min_32_characters
GROK_API_KEY=your_grok_api_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
NODE_ENV=development
```

#### Client Environment Variables

Create a `.env` file in the `client` directory:

```bash
cd ../client
cp .env.example .env
```

Edit the `.env` file:

```env
VITE_API_URL=http://localhost:5000/api
```

### 4. MongoDB Setup

#### Option A: MongoDB Atlas (Recommended for Production)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster
4. Create a database user
5. Whitelist your IP address (or use 0.0.0.0/0 for development)
6. Get your connection string and update `MONGODB_URI` in server `.env`

#### Option B: Local MongoDB

1. Install MongoDB locally
2. Start MongoDB service:
   ```bash
   mongod
   ```
3. Update `MONGODB_URI` in server `.env`:
   ```env
   MONGODB_URI=mongodb://localhost:27017/property-pulse
   ```

### 5. Cloudinary Setup

1. Go to [Cloudinary](https://cloudinary.com/)
2. Create a free account
3. Navigate to Dashboard
4. Copy your Cloud Name, API Key, and API Secret
5. Update the Cloudinary variables in server `.env`

### 6. Grok API Setup

1. Go to [xAI Console](https://console.x.ai/)
2. Create an account or sign in
3. Navigate to API Keys section
4. Create a new API key
5. Update `GROK_API_KEY` in server `.env`

**Note**: Grok API is free to use with generous rate limits. No billing setup required!

## Running the Application

### Development Mode

#### Option 1: Run Both Client and Server Together

From the root directory:

```bash
npm run dev
```

This will start both the backend server (port 5000) and frontend dev server (port 3000).

#### Option 2: Run Separately

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```

### Production Build

#### Build Backend:
```bash
cd server
npm run build
npm start
```

#### Build Frontend:
```bash
cd client
npm run build
npm run preview
```

## Testing the Application

### 1. Create a User Account

1. Navigate to `http://localhost:3000/register`
2. Fill in the registration form
3. Submit to create an account

### 2. Login

1. Navigate to `http://localhost:3000/login`
2. Enter your credentials
3. You'll be redirected to the dashboard

### 3. Create a Property Listing

1. From the dashboard, click "Create New Listing"
2. Fill in all property details
3. Upload property images
4. Optionally use "Generate with AI" for description
5. Submit the form

### 4. Test AI Search

1. Navigate to Properties page
2. Use the AI search bar with natural language queries like:
   - "Find me a 3-bedroom house under $500,000"
   - "Show apartments in New York"
   - "Properties with 2 bathrooms near downtown"

### 5. Add to Favorites

1. Browse properties
2. Click the heart icon on any property card
3. View your favorites from the "Favorites" page

## Troubleshooting

### Common Issues

#### Port Already in Use

If port 5000 or 3000 is already in use:

```bash
# Find and kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Find and kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

#### MongoDB Connection Error

- Verify MongoDB is running
- Check connection string in `.env`
- Ensure IP is whitelisted in MongoDB Atlas
- Check database user credentials

#### Cloudinary Upload Error

- Verify API credentials are correct
- Check file size (max 5MB)
- Ensure file is an image format

#### Grok API Error

- Verify API key is valid
- Check you have available credits
- Review rate limits

### Environment Variable Issues

Make sure all required environment variables are set:

```bash
# Server
cd server
cat .env

# Client  
cd client
cat .env
```

## Next Steps

- Read [API.md](./API.md) for API documentation
- Read [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment guide
- Explore the codebase to understand the architecture

## Support

For issues and questions:
- Check existing documentation
- Review error logs in terminal
- Check browser console for frontend errors
- Verify all environment variables are correctly set
