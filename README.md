# AromaDB - Aromatherapy Recipe Management System

AromaDB is a full-stack web application for managing aromatherapy recipes, ingredients, and packaging materials. It provides a user-friendly interface for creating and managing essential oil blends, tracking inventory, and calculating costs.

## Features

- **Ingredient Management**
  - Track essential oils, carrier oils, and other ingredients
  - Support for both ml and drops measurements
  - Inventory tracking
  - Price management

- **Recipe Management**
  - Create and edit aromatherapy blends
  - Automatic cost calculation
  - Flexible measurement system (ml/drops)
  - Set retail prices

- **Packaging Management**
  - Track different packaging components (bottles, caps, labels)
  - Create packaging bundles
  - Manage inventory
  - Calculate packaging costs

## Tech Stack

- **Backend**
  - FastAPI (Python)
  - SQLAlchemy
  - SQLite
  - Pydantic
  - Uvicorn

- **Frontend**
  - React
  - TypeScript
  - Material-UI
  - React Router
  - Axios

## Setup

### Prerequisites

- Python 3.8+
- Node.js 14+
- npm or yarn

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
   pip install -r requirements.txt
   ```

4. Run the development server:
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

## Usage

1. Access the application at `http://localhost:5173`
2. Start by adding your ingredients in the Ingredients section
3. Create packaging items and bundles in the Packaging section
4. Create recipes using your ingredients and packaging options

## API Documentation

The API documentation is available at `http://localhost:8000/docs` when running the backend server.

## Project Structure

```
AromaDB/
├── backend/
│   ├── models.py         # Database models
│   ├── schemas.py        # Pydantic schemas
│   ├── database.py       # Database configuration
│   ├── main.py          # FastAPI application
│   └── requirements.txt  # Python dependencies
│
└── frontend/
    ├── src/
    │   ├── components/   # React components
    │   ├── services/     # API services
    │   └── types/        # TypeScript types
    ├── package.json
    └── vite.config.ts
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 