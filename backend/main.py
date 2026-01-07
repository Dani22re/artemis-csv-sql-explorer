import duckdb
from pydantic import BaseModel
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import os
import uuid

app = FastAPI()

FRONTEND_ORIGIN = os.getenv("FRONTEND_ORIGIN") 

allow_origins = []
if FRONTEND_ORIGIN:
    allow_origins.append(FRONTEND_ORIGIN)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

class QueryRequest(BaseModel):
    dataset_id: str
    sql: str

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/upload")
async def upload(file: UploadFile = File(...)):
    if not file.filename or not file.filename.lower().endswith(".csv"):
        return {"error": "Please upload a .csv file"}

    dataset_id = str(uuid.uuid4())
    out_path = os.path.join(UPLOAD_DIR, f"{dataset_id}.csv")

    with open(out_path, "wb") as f:
        while True:
            chunk = await file.read(1024 * 1024)
            if not chunk:
                break
            f.write(chunk)

    return {"dataset_id": dataset_id}

@app.post("/query")
def query_csv(req: QueryRequest):
    csv_path = os.path.join(UPLOAD_DIR, f"{req.dataset_id}.csv")
    if not os.path.exists(csv_path):
        return {"error": "Dataset not found"}

    con = duckdb.connect()
    try:
        con.execute(f"""
            CREATE OR REPLACE VIEW tablename AS
            SELECT * FROM read_csv_auto('{csv_path}');
        """)
        result = con.execute(req.sql).fetchall()
        columns = [d[0] for d in con.description]
        return {"columns": columns, "rows": result}
    except Exception as e:
        return {"error": str(e)}
    finally:
        con.close()