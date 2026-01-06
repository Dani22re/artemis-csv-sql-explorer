# Artemis

**Home Assignment - CSV Files SQL Explorer**

A full-stack application that allows uploading CSV files and querying them using SQL.

## Features
- Upload CSV files
- Query data using SQL (DuckDB)
- Instant results displayed in a table
- Simple, clean UI (React + Vite)

## Tech Stack
- **Frontend:** React, TypeScript, Vite
- **Backend:** FastAPI, Python
- **Database Engine:** DuckDB

Artemis/
├── backend/
│ ├── main.py
│ ├── uploads/
│ └── requirements.txt
│
├── frontend/
│ ├── src/
│ │ ├── App.tsx
│ │ ├── App.css
│ │ └── main.tsx
│ └── package.json
│
└── README.md


## How It Works

1. The user uploads a CSV file
2. The backend stores the file and creates a DuckDB VIEW named `tablename`
3. The user writes SQL queries against `tablename`
4. Results are returned and rendered in a table on the frontend

## Example CSV

```csv
employee_id,name,department,salary,hire_date
1,Alice Johnson,Engineering,145000,2019-03-12
2,Bob Martinez,Sales,98000,2020-07-01
3,Carol Lee,Engineering,158000,2018-11-23
4,David Kim,Marketing,112000,2021-01-15
5,Eva Smith,Sales,102500,2022-05-03
6,Frank Zhao,Engineering,132000,2020-09-30

##Backend
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python -m uvicorn main:app --reload --port 8000
Backend will run on:
http://localhost:8000

##Frontend
cd frontend
npm install
npm run dev
Frontend will run on:
http://localhost:5173


## API Endpoints
POST /upload
Uploads a CSV file and returns a dataset_id
POST /query
Runs a SQL query against the uploaded CSV using DuckDB
Request body:
{
  "dataset_id": "string",
  "sql": "SELECT * FROM tablename LIMIT 5"
}
