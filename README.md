# Artemis

**Home Assignment - CSV Files SQL Explorer**

A full-stack application that allows uploading CSV files and querying them using SQL.

## Run publicly
Frontend: https://artemis-csv-sql-explorer.vercel.app
Backend: https://artemis-csv-sql-explorer-backend.onrender.com

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
1.User uploads a CSV file.
2.Backend streams the file to disk and assigns a dataset_id.
3.DuckDB creates a VIEW called tablename from the CSV.
4.User runs SQL queries against tablename.
5.Results are returned and displayed in the UI.

## Example CSV
SELECT * FROM tablename LIMIT 5;

## Example CSV

```csv
employee_id,name,department,salary,hire_date
1,Alice Johnson,Engineering,145000,2019-03-12
2,Bob Martinez,Sales,98000,2020-07-01
3,Carol Lee,Engineering,158000,2018-11-23
4,David Kim,Marketing,112000,2021-01-15
5,Eva Smith,Sales,102500,2022-05-03
6,Frank Zhao,Engineering,132000,2020-09-30

