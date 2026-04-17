# Inventory Alert Microservice

A production-ready, in-memory Inventory Alert Microservice built with Node.js and Express.

## Project Structure

```
inventory-microserver/
├── config/
│   └── app.js                  # Express app setup
├── controllers/
│   ├── inventoryController.js  # Product & stock handlers
│   └── alertController.js      # Alert handlers
├── data/
│   └── store.js                # In-memory data store
├── middleware/
│   ├── errorMiddleware.js      # Centralized error handler
│   ├── rateLimiter.js          # Rate limiting
│   └── validator.js            # Input validation rules
├── routes/
│   ├── inventoryRoutes.js
│   └── alertRoutes.js
├── services/
│   ├── inventoryService.js     # Business logic
│   └── alertService.js         # Threshold check & alert creation
├── tests/
│   └── alertService.test.js    # Jest unit tests
├── utils/
│   └── uuid.js                 # UUID generator
├── .env
├── .gitignore
├── package.json
└── server.js
```

## Setup & Run

```bash
# Install dependencies
npm install

# Start in development mode (with nodemon)
npm run dev

# Start in production mode
npm start

# Run tests
npm test
```

## Environment Variables (.env)

| Variable               | Default   | Description                        |
|------------------------|-----------|------------------------------------|
| PORT                   | 3000      | Server port                        |
| NODE_ENV               | development | Environment mode                 |
| RATE_LIMIT_WINDOW_MS   | 900000    | Rate limit window (15 min in ms)   |
| RATE_LIMIT_MAX         | 100       | Max requests per window            |

---

## API Reference

### POST /api/product — Add or Update Product

**Request:**
```json
POST http://localhost:3000/api/product
Content-Type: application/json

{
  "productName": "Wireless Mouse",
  "quantity": 5,
  "thresholdLevel": 10
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "productId": "a1b2c3d4-...",
    "productName": "Wireless Mouse",
    "quantity": 5,
    "thresholdLevel": 10
  }
}
```
> Since quantity (5) < thresholdLevel (10), an alert is automatically triggered.

---

### GET /api/products — Fetch All Products

**Request:**
```
GET http://localhost:3000/api/products
```

**Response (200 OK):**
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "productId": "a1b2c3d4-...",
      "productName": "Wireless Mouse",
      "quantity": 5,
      "thresholdLevel": 10
    }
  ]
}
```

---

### PUT /api/stock — Update Stock Quantity

**Request:**
```json
PUT http://localhost:3000/api/stock
Content-Type: application/json

{
  "productId": "a1b2c3d4-...",
  "quantity": 2
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "productId": "a1b2c3d4-...",
    "productName": "Wireless Mouse",
    "quantity": 2,
    "thresholdLevel": 10
  }
}
```

---

### GET /api/alerts — Fetch All Alerts

**Request:**
```
GET http://localhost:3000/api/alerts
```

**Response (200 OK):**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": "x9y8z7...",
      "productId": "a1b2c3d4-...",
      "productName": "Wireless Mouse",
      "message": "Low stock alert: \"Wireless Mouse\" has 5 units left (threshold: 10).",
      "timestamp": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

---

## HTTP Status Codes

| Code | Meaning                        |
|------|--------------------------------|
| 200  | OK — successful GET/PUT        |
| 201  | Created — new product added    |
| 400  | Bad Request — validation error |
| 404  | Not Found — product not found  |
| 429  | Too Many Requests — rate limit |
| 500  | Internal Server Error          |

---

## Alert Logic

An alert is automatically created whenever:
- A product is added via `POST /api/product` with `quantity < thresholdLevel`
- Stock is updated via `PUT /api/stock` and the new `quantity < thresholdLevel`
- A product is updated via `POST /api/product` (with existing `productId`) and `quantity < thresholdLevel`

Each alert contains: `id`, `productId`, `productName`, `message`, `timestamp`.

## Postman Collection (Quick Import)

You can manually create a Postman collection with these 4 requests:

1. `POST http://localhost:3000/api/product` — body: `{ "productName": "...", "quantity": 5, "thresholdLevel": 10 }`
2. `GET http://localhost:3000/api/products`
3. `PUT http://localhost:3000/api/stock` — body: `{ "productId": "<uuid>", "quantity": 2 }`
4. `GET http://localhost:3000/api/alerts`
