# Risk Monitoring System

A mini risk monitoring application that demonstrates a full-stack solution for tracking client portfolio risk and margin calls.

## High-Level Architecture

This application follows a three-tier architecture:

1. **Database Layer (PostgreSQL)**: Stores client data, positions, market data, and margin information
2. **Backend API (Flask)**: Processes business logic, calculates margin requirements, and serves data to the frontend
3. **Frontend (React with TypeScript)**: Displays client portfolio information and margin status in a responsive dashboard

```
┌────────────┐     ┌────────────┐     ┌────────────┐
│            │     │            │     │            │
│  React     │◄────┤  Flask     │◄────┤ PostgreSQL │
│  Frontend  │     │  API       │     │ Database   │
│            │     │            │     │            │
└────────────┘     └────────────┘     └────────────┘
```

## Tech Stack Explanation

- **Database**: PostgreSQL was chosen for its robustness, ACID compliance, and excellent support for financial data where transactions and data integrity are crucial.
- **Backend**: Flask provides a lightweight yet powerful Python framework that allows for quick development while maintaining flexibility.
- **Frontend**: React with TypeScript provides a component-based architecture with type safety, making the UI more maintainable and less prone to errors.

## Setup Instructions

### Prerequisites

- Node.js and npm
- Python 3.8+
- PostgreSQL
- API key from a stock market data provider (e.g., Twelve Data)

### Database Setup

1. Install PostgreSQL if not already installed
2. Create a database:
   ```sql
   CREATE DATABASE risk_monitoring;
   ```

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install flask flask-sqlalchemy flask-cors psycopg2-binary requests python-dotenv
   ```

4. Create a `.env` file in the backend directory:
   ```
   MARKET_API_KEY=your_api_key_here
   ```

5. Seed the database with sample data:
   ```bash
   python seed_data.py
   ```

6. Start the Flask server:
   ```bash
   python app.py
   ```

### Frontend Setup

1. Navigate to the client directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open your browser and navigate to `http://localhost:3000`

## Usage

### API Endpoints

- **GET /api/market-data**: Retrieves all current market data
- **GET /api/positions/:clientId**: Retrieves all positions for a specific client
- **GET /api/margin-status/:clientId**: Calculates and returns margin status for a client
- **POST /api/positions**: Creates a new position

### Sample API Requests

```bash
# Get margin status for client with ID 1
curl http://localhost:5000/api/margin-status/1

# Get positions for client with ID 1
curl http://localhost:5000/api/positions/1

# Get all market data
curl http://localhost:5000/api/market-data
```

## Testing

The margin calculation logic has been tested with various scenarios:

1. **Healthy Portfolio**: No margin call triggered when net equity exceeds margin requirement
2. **Margin Call Scenario**: Margin call triggered when net equity falls below margin requirement
3. **Edge Cases**: Zero positions, extremely large positions, negative loan amounts

Sample test case:
- Client has 100 shares of Stock A @ $50 each and 200 shares of Stock B @ $20 each
- Loan amount: $3,000
- Portfolio Market Value = (100 × 50) + (200 × 20) = $9,000
- Net Equity = $9,000 - $3,000 = $6,000
- Total Margin Requirement = 0.25 × $9,000 = $2,250
- Margin Shortfall = $2,250 - $6,000 = -$3,750 (negative, so no margin call)

## Known Limitations

1. The application uses a simplified margin calculation model
2. Market data is fetched at fixed intervals rather than through a live streaming connection
3. No authentication system is implemented in this minimal version
4. The free tier of market data APIs may have request limits
5. No notifications system for margin calls (besides UI indication)