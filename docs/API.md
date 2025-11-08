# Property Pulse API Documentation

## Base URL

```
http://localhost:5000/api
```

## Authentication

Most endpoints require authentication using JWT tokens. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Endpoints

### Authentication Endpoints

#### Register User

**POST** `/auth/register`

Register a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "60d5ec49f1b2c8b1f8e4e1a1",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### Login

**POST** `/auth/login`

Login with email and password.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "60d5ec49f1b2c8b1f8e4e1a1",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### Get Current User

**GET** `/auth/me`

Get current logged-in user details. (Protected)

**Response:** `200 OK`
```json
{
  "success": true,
  "user": {
    "id": "60d5ec49f1b2c8b1f8e4e1a1",
    "name": "John Doe",
    "email": "john@example.com",
    "favorites": ["property_id_1", "property_id_2"]
  }
}
```

### Property Endpoints

#### Get All Properties

**GET** `/properties`

Get all properties with optional filters.

**Query Parameters:**
- `status` - Filter by status (for-sale, sold, rented)
- `propertyType` - Filter by type (house, apartment, condo, land, commercial)
- `minPrice` - Minimum price
- `maxPrice` - Maximum price
- `bedrooms` - Minimum bedrooms
- `bathrooms` - Minimum bathrooms
- `city` - Filter by city
- `state` - Filter by state
- `page` - Page number (default: 1)
- `limit` - Results per page (default: 12)

**Example:**
```
GET /properties?propertyType=house&minPrice=200000&maxPrice=500000&bedrooms=3
```

**Response:** `200 OK`
```json
{
  "success": true,
  "properties": [...],
  "pagination": {
    "page": 1,
    "limit": 12,
    "total": 45,
    "pages": 4
  }
}
```

#### Get Property by ID

**GET** `/properties/:id`

Get a single property by ID.

**Response:** `200 OK`
```json
{
  "success": true,
  "property": {
    "_id": "60d5ec49f1b2c8b1f8e4e1a1",
    "title": "Beautiful 3BR House",
    "description": "...",
    "price": 450000,
    "location": {
      "address": "123 Main St",
      "city": "San Francisco",
      "state": "CA",
      "zipCode": "94102"
    },
    "bedrooms": 3,
    "bathrooms": 2,
    "area": 2000,
    "propertyType": "house",
    "status": "for-sale",
    "images": ["url1", "url2"],
    "owner": {
      "_id": "owner_id",
      "name": "Jane Smith",
      "email": "jane@example.com"
    },
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

#### Create Property

**POST** `/properties`

Create a new property listing. (Protected)

**Content-Type:** `multipart/form-data`

**Form Fields:**
- `title` - Property title (required)
- `description` - Property description (required)
- `price` - Price in USD (required)
- `location[address]` - Street address (required)
- `location[city]` - City (required)
- `location[state]` - State (required)
- `location[zipCode]` - Zip code (required)
- `bedrooms` - Number of bedrooms (required)
- `bathrooms` - Number of bathrooms (required)
- `area` - Area in square feet (required)
- `propertyType` - Type of property (required)
- `status` - Property status (required)
- `images` - Property images (up to 10 files)

**Response:** `201 Created`
```json
{
  "success": true,
  "message": "Property created successfully",
  "property": { ... }
}
```

#### Update Property

**PUT** `/properties/:id`

Update an existing property. (Protected, Owner Only)

**Content-Type:** `multipart/form-data`

Same fields as Create Property (all optional).

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Property updated successfully",
  "property": { ... }
}
```

#### Delete Property

**DELETE** `/properties/:id`

Delete a property. (Protected, Owner Only)

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Property deleted successfully"
}
```

#### Get Properties by User

**GET** `/properties/user/:userId`

Get all properties listed by a specific user.

**Response:** `200 OK`
```json
{
  "success": true,
  "properties": [...],
  "count": 5
}
```

### Favorites Endpoints

#### Add to Favorites

**POST** `/auth/favorites/:propertyId`

Add a property to user's favorites. (Protected)

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Property added to favorites",
  "favorites": ["property_id_1", "property_id_2"]
}
```

#### Remove from Favorites

**DELETE** `/auth/favorites/:propertyId`

Remove a property from favorites. (Protected)

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Property removed from favorites",
  "favorites": ["property_id_1"]
}
```

#### Get Favorites

**GET** `/auth/favorites`

Get all user's favorite properties. (Protected)

**Response:** `200 OK`
```json
{
  "success": true,
  "favorites": [
    { property object },
    { property object }
  ]
}
```

### AI Endpoints

#### AI Natural Language Search

**POST** `/ai/search`

Search properties using natural language.

**Request Body:**
```json
{
  "query": "Find me a 3-bedroom house near downtown under $500k"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "properties": [...],
  "criteria": {
    "bedrooms": 3,
    "propertyType": "house",
    "priceMax": 500000
  },
  "query": "Find me a 3-bedroom house near downtown under $500k"
}
```

**Rate Limit:** 20 requests per 15 minutes

#### Generate Property Description

**POST** `/ai/generate-description`

Generate an AI-powered property description.

**Request Body:**
```json
{
  "propertyDetails": {
    "title": "Modern Downtown Condo",
    "propertyType": "condo",
    "bedrooms": 2,
    "bathrooms": 2,
    "area": 1200,
    "location": "San Francisco, CA",
    "price": 750000
  }
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "description": "Welcome to this stunning modern condo in the heart of San Francisco..."
}
```

**Rate Limit:** 20 requests per 15 minutes

#### Get AI Recommendations

**POST** `/ai/recommend`

Get AI-powered property recommendations.

**Request Body:**
```json
{
  "userPreferences": {
    "priceRange": { "min": 200000, "max": 500000 },
    "bedrooms": 3,
    "bathrooms": 2,
    "propertyType": "house",
    "location": "California"
  },
  "excludePropertyIds": ["property_id_1"]
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "recommendations": [...],
  "count": 10
}
```

**Rate Limit:** 20 requests per 15 minutes

## Error Responses

All endpoints return errors in the following format:

```json
{
  "success": false,
  "message": "Error message",
  "errors": [
    {
      "field": "email",
      "message": "Valid email is required"
    }
  ]
}
```

### Common Error Codes

- `400` - Bad Request (validation errors)
- `401` - Unauthorized (no token or invalid token)
- `403` - Forbidden (not authorized to perform action)
- `404` - Not Found
- `429` - Too Many Requests (rate limit exceeded)
- `500` - Internal Server Error

## Rate Limiting

AI endpoints are rate-limited to prevent abuse:
- **Limit:** 20 requests per 15 minutes per IP
- **Headers:**
  - `X-RateLimit-Limit`: Maximum requests allowed
  - `X-RateLimit-Remaining`: Remaining requests
  - `X-RateLimit-Reset`: Time when limit resets

## Testing with cURL

### Register a user:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'
```

### Get properties:
```bash
curl http://localhost:5000/api/properties
```

### AI Search:
```bash
curl -X POST http://localhost:5000/api/ai/search \
  -H "Content-Type: application/json" \
  -d '{"query":"3 bedroom house under 500k"}'
```

## Notes

- All timestamps are in ISO 8601 format
- File uploads are limited to 5MB per image
- Maximum 10 images per property
- JWT tokens expire after 7 days
