import { useMemo, useState } from "react";
import "./App.css";
const API_BASE = import.meta.env.VITE_API_BASE;
if (!API_BASE) {
  throw new Error("Missing VITE_API_BASE env var");
}

type QueryResponse =
  | { columns: string[]; rows: any[][] }
  | { error: string };

export default function App() {
  const [file, setFile] = useState<File | null>(null);
  const [datasetId, setDatasetId] = useState<string>("");
  const [sql, setSql] = useState<string>("SELECT * FROM tablename LIMIT 5");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [result, setResult] = useState<{ columns: string[]; rows: any[][] } | null>(null);

  const canQuery = useMemo(() => datasetId.trim().length > 0, [datasetId]);

  async function handleUpload() {
    
    setError("");
    setResult(null);

    if (!file) {
      setError("Please choose a CSV file first.");
      return;
    }
    if (!file.name.toLowerCase().endsWith(".csv")) {
      setError("File must be a .csv");
      return;
    }

    setLoading(true);
    try {
      const form = new FormData();
      form.append("file", file);

      const res = await fetch(`${API_BASE}/upload`, {
        method: "POST",
        body: form,
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        setError(data.error || "Upload failed");
        return;
      }

      setDatasetId(data.dataset_id);
    } catch (e: any) {
      setError(e?.message || "Upload error");
    } finally {
      setLoading(false);
    }
  }

  async function handleRunQuery() {
    setError("");
    setResult(null);

    if (!canQuery) {
      setError("Upload a CSV first (dataset_id is missing).");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/query`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dataset_id: datasetId, sql }),
      });

      const data: QueryResponse = await res.json();
      if (!res.ok || "error" in data) {
        setError(("error" in data && data.error) || "Query failed");
        return;
      }

      setResult({ columns: data.columns, rows: data.rows });
    } catch (e: any) {
      setError(e?.message || "Query error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page">
      <header className="header fade-in delay-1">
        <div>
          <h1>Artemis</h1>
          <p className="subtitle">
            Home Assignment · CSV Files SQL Explorer
          </p>
        </div>

        <div className="byline">
          by <strong>Danielle Reich</strong>
        </div>
      </header>



      <section className="card fade-in delay-2">
        <h2> Upload CSV</h2>
        <div className="row">
          <input
            type="file"
            accept=".csv,text/csv"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
          <button className="primary" onClick={handleUpload} disabled={loading || !file}>
            {loading ? "Working..." : "Upload"}
          </button>
        </div>

        <div className="small">
          <div><b>dataset_id:</b> {datasetId ? <code>{datasetId}</code> : "—"}</div>
        </div>
      </section>

      <section className="card fade-in delay-3">
        <h2> Run SQL</h2>
        <textarea
          className="textarea"
          value={sql}
          onChange={(e) => setSql(e.target.value)}
          placeholder="Example: SELECT * FROM tablename LIMIT 5"
        />
        <div className="row">
          <button className="primary" onClick={handleRunQuery} disabled={loading || !canQuery}>
            {loading ? "Running..." : "Run Query"}
          </button>
        </div>

        {error && <div className="error">⚠️ {error}</div>}
      </section>

      <section className="card">
        <h2>Results</h2>
        {!result && <div className="muted">No results yet.</div>}

        {result && (
          <div className="tableWrap">
            <table>
              <thead>
                <tr>
                  {result.columns.map((c) => (
                    <th key={c}>{c}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {result.rows.map((r, i) => (
                  <tr key={i}>
                    {r.map((cell, j) => (
                      <td key={j}>{String(cell)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
