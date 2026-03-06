import { useEffect, useState } from "react";
import { api, getErrorMessage } from "../api";

export default function Home() {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [slotId, setSlotId] = useState("");
  const [studentName, setStudentName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(null);

  async function loadSlots() {
    const res = await api.get("/slots");
    setSlots(res.data);
  }

  

  useEffect(() => {
    (async () => {
      try {
        setError(null);
        setLoading(true);
        await loadSlots();
      } catch (e) {
        setError(getErrorMessage(e));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function handleBooking(e) {
    e.preventDefault();
    try {
      setError(null);
      setSuccess(null);
      setSubmitting(true);

      const res = await api.post("/bookings", {
        slot_id: slotId,
        student_name: studentName,
        student_id: studentId,
        reason,
      });

      setSuccess(
        `La réservation N°${res.data.id} a été enregistrée avec succès.
      Statut actuel : ${res.data.status}.`
      );
      setReason("");
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setSubmitting(false);
    }
  }

  // ----- Styles UI simples (inline) -----
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

  const titleRow = {
    display: "flex",
    alignItems: "baseline",
    justifyContent: "space-between",
    gap: 10,
  };

  const subtitle = {
    marginTop: 4,
    color: "#6b7280",
    fontSize: 13,
  };

  const alert = (type) => ({
    padding: "10px 12px",
    borderRadius: 10,
    border: "1px solid",
    background: type === "error" ? "#fff5f5" : "#f0fdf4",
    borderColor: type === "error" ? "#fecaca" : "#bbf7d0",
    color: type === "error" ? "#991b1b" : "#166534",
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

  const input = {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 10,
    border: "1px solid #d1d5db",
    outline: "none",
  };

  const label = {
    display: "grid",
    gap: 6,
    fontSize: 13,
    color: "#374151",
  };

  const btn = {
    padding: "10px 12px",
    borderRadius: 10,
    border: "1px solid #111827",
    background: "#111827",
    color: "white",
    fontWeight: 600,
    cursor: "pointer",
    opacity: submitting ? 0.8 : 1,
  };

  const smallNote = {
    marginTop: 10,
    fontSize: 13,
    color: "#6b7280",
  };

  return (
    <div style={container}>
      {/* ---- Section slots ---- */}
      <div style={card}>
        <div style={titleRow}>
          <h3 style={{ margin: 0 }}>Créneaux disponibles</h3>
          <span style={{ fontSize: 12, color: "#6b7280" }}>
            Total: {loading ? "..." : slots.length}
          </span>
        </div>
        <div style={subtitle}>Liste des créneaux disponibles avec leur capacité.</div>

        <div style={{ marginTop: 12, display: "grid", gap: 10 }}>
          {loading && <div style={{ color: "#6b7280" }}>Chargement...</div>}
          {error && <div style={alert("error")}>Erreur: {error}</div>}
          {success && <div style={alert("success")}>{success}</div>}

          {!loading && slots.length === 0 && (
            <div style={{ color: "#6b7280" }}>Aucun créneau.</div>
          )}

          {!loading && slots.length > 0 && (
            <div style={tableWrap}>
              <table style={table}>
                <thead>
                  <tr>
                    <th style={th}>ID</th>
                    <th style={th}>Date/Heure</th>
                    <th style={th}>Capacité</th>
                  </tr>
                </thead>
                <tbody>
                  {slots.map((s, idx) => (
                    <tr key={s.id} style={{ background: idx % 2 === 0 ? "#ffffff" : "#fcfcfd" }}>
                      <td style={td}>{s.id}</td>
                      <td style={td}>{s.datetime}</td>
                      <td style={td}>{s.capacity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ---- Section booking ---- */}
      <div style={card}>
        <h3 style={{ marginTop: 0 }}>Réserver un créneau</h3>

        <form onSubmit={handleBooking} style={{ display: "grid", gap: 12, maxWidth: 480 }}>
          <label style={label}>
            Slot ID
            <input
              style={input}
              value={slotId}
              onChange={(e) => setSlotId(e.target.value)}
              placeholder="ex: 1"
              required
            />
          </label>

          <label style={label}>
            Nom étudiant
            <input
              style={input}
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              placeholder="ex: Said Boussif"
              required
            />
          </label>

          <label style={label}>
            CNE / ID étudiant
            <input
              style={input}
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              placeholder="ex: CNE123"
              required
            />
          </label>

          <label style={label}>
            Motif
            <input
              style={input}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="ex: Retrait de matériel"
              required
            />
          </label>

          <button style={btn} disabled={submitting}>
            {submitting ? "Envoi..." : "Réserver"}
          </button>
        </form>
      </div>
    </div>
  );
}