import { useState } from "react";
import { api, getErrorMessage } from "../api";

export default function MyBookings() {
  const [studentId, setStudentId] = useState("");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);

  async function search() {
    try {
      setError(null);
      setLoading(true);
      setSearched(true);

      const res = await api.get("/bookings");
      const filtered = res.data.filter((b) => b.student_id === studentId);
      setBookings(filtered);
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }

  const container = {
    maxWidth: 900,
    margin: "0 auto",
    display: "grid",
    gap: 14,
  };

  const card = {
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: 12,
    padding: 14,
    boxShadow: "0 1px 8px rgba(0,0,0,0.06)",
  };

  const input = {
    padding: "10px 12px",
    borderRadius: 10,
    border: "1px solid #d1d5db",
    outline: "none",
    width: 250,
  };

  const btn = {
    padding: "10px 14px",
    borderRadius: 10,
    border: "1px solid #111827",
    background: "#111827",
    color: "white",
    fontWeight: 600,
    cursor: "pointer",
    opacity: loading ? 0.8 : 1,
  };

  const alert = (type) => ({
    padding: "10px 12px",
    borderRadius: 10,
    border: "1px solid",
    background: type === "error" ? "#fff5f5" : "#f9fafb",
    borderColor: type === "error" ? "#fecaca" : "#e5e7eb",
    color: type === "error" ? "#991b1b" : "#374151",
  });

  const tableWrap = {
    overflowX: "auto",
    borderRadius: 10,
    border: "1px solid #e5e7eb",
  };

  const table = {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: 520,
  };

  const th = {
    textAlign: "left",
    fontSize: 13,
    color: "#374151",
    background: "#f9fafb",
    borderBottom: "1px solid #e5e7eb",
    padding: "10px 12px",
  };

  const td = {
    padding: "10px 12px",
    borderBottom: "1px solid #f1f5f9",
    fontSize: 14,
    color: "#111827",
  };

  const badge = (status) => ({
    padding: "4px 8px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 600,
    background:
      status === "confirmed"
        ? "#dcfce7"
        : status === "done"
        ? "#e0f2fe"
        : status === "canceled"
        ? "#fee2e2"
        : "#f3f4f6",
    color:
      status === "confirmed"
        ? "#166534"
        : status === "done"
        ? "#075985"
        : status === "canceled"
        ? "#991b1b"
        : "#374151",
  });

  return (
    <div style={container}>
      <div style={card}>
        <h3 style={{ marginTop: 0 }}>Mes réservations</h3>

        <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 14 }}>
          <input
            style={input}
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            placeholder="Entrer votre CNE / ID étudiant"
          />
          <button onClick={search} disabled={!studentId || loading} style={btn}>
            {loading ? "Recherche..." : "Rechercher"}
          </button>
        </div>

        {error && <div style={alert("error")}>Erreur: {error}</div>}

        {searched && !loading && !error && bookings.length === 0 && (
          <div style={{ marginTop: 10, color: "#6b7280" }}>
            Aucune réservation trouvée.
          </div>
        )}

        {bookings.length > 0 && (
          <div style={tableWrap}>
            <table style={table}>
              <thead>
                <tr>
                  <th style={th}>ID</th>
                  <th style={th}>Créneau</th>
                  <th style={th}>Motif</th>
                  <th style={th}>Statut</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b, idx) => (
                  <tr
                    key={b.id}
                    style={{
                      background: idx % 2 === 0 ? "#ffffff" : "#fcfcfd",
                    }}
                  >
                    <td style={td}>{b.id}</td>
                    <td style={td}>
                      {b.slot_datetime} (slot #{b.slot_id})
                    </td>
                    <td style={td}>{b.reason}</td>
                    <td style={td}>
                      <span style={badge(b.status)}>{b.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}






