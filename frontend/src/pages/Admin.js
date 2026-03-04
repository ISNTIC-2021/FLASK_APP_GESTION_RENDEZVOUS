import { useEffect, useState } from "react";
import { api, getErrorMessage } from "../api";

const allowed = ["pending", "confirmed", "done", "canceled"];

export default function Admin() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const [slots, setSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(true);

  const [error, setError] = useState(null);
  const [msg, setMsg] = useState(null);

  const [slotDatetime, setSlotDatetime] = useState("");
  const [slotCapacity, setSlotCapacity] = useState(1);
  const [creatingSlot, setCreatingSlot] = useState(false);

  async function loadBookings() {
    const res = await api.get("/bookings");
    setBookings(res.data);
  }

  async function loadSlots() {
    const res = await api.get("/slots");
    setSlots(res.data);
  }

  useEffect(() => {
    (async () => {
      try {
        setError(null);
        setLoading(true);
        setLoadingSlots(true);
        await Promise.all([loadBookings(), loadSlots()]);
      } catch (e) {
        setError(getErrorMessage(e));
      } finally {
        setLoading(false);
        setLoadingSlots(false);
      }
    })();
  }, []);

  async function changeStatus(id, status) {
    try {
      setError(null);
      setMsg(null);

      await api.patch(`/bookings/${id}`, { status });

      setMsg(
        `La réservation N°${id} a été mise à jour avec succès.
      Nouveau statut : ${status}.`
      );
      await loadBookings();
    } catch (e) {
      setError(getErrorMessage(e));
    }
  }

  async function createSlot(e) {
    e.preventDefault();

    try {
      setError(null);
      setMsg(null);
      setCreatingSlot(true);

      if (!slotDatetime.trim()) {
        setError("La date/heure est obligatoire");
        return;
      }
      const cap = parseInt(slotCapacity, 10);
      if (Number.isNaN(cap) || cap <= 0) {
        setError("La capacité doit être un entier > 0");
        return;
      }

      const res = await api.post("/slots", {
        datetime: slotDatetime,
        capacity: cap,
      });

      setMsg(
        `✅ Créneau N°${res.data.id} créé avec succès.
      📅 Date : ${res.data.datetime}
      👥 Capacité : ${res.data.capacity} places`
      );
      setSlotDatetime("");
      setSlotCapacity(1);

      await loadSlots();
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setCreatingSlot(false);
    }
  }

  // ---- UI styles (inline, simple) ----
  const container = {
    maxWidth: 1000,
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

  const btn = (kind = "primary") => ({
    padding: "10px 12px",
    borderRadius: 10,
    border: "1px solid",
    cursor: "pointer",
    fontWeight: 700,
    ...(kind === "primary"
      ? { background: "#111827", color: "white", borderColor: "#111827" }
      : { background: "white", color: "#111827", borderColor: "#d1d5db" }),
    opacity: creatingSlot ? 0.85 : 1,
  });

  const tableWrap = {
    overflowX: "auto",
    borderRadius: 10,
    border: "1px solid #e5e7eb",
  };

  const table = {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: 720,
  };

  const th = {
    textAlign: "left",
    fontSize: 13,
    color: "#374151",
    background: "#f9fafb",
    borderBottom: "1px solid #e5e7eb",
    padding: "10px 12px",
    whiteSpace: "nowrap",
  };

  const td = {
    padding: "10px 12px",
    borderBottom: "1px solid #f1f5f9",
    fontSize: 14,
    color: "#111827",
    verticalAlign: "top",
  };

  const statusBadge = (status) => ({
    padding: "4px 8px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 700,
    display: "inline-block",
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

  const select = {
    padding: "8px 10px",
    borderRadius: 10,
    border: "1px solid #d1d5db",
    outline: "none",
    background: "white",
    fontWeight: 600,
  };

  return (
    <div style={container}>
      <div style={card}>
        <div style={titleRow}>
          <h3 style={{ margin: 0 }}>Admin</h3>
          <span style={{ fontSize: 12, color: "#6b7280" }}>
            Slots: {loadingSlots ? "..." : slots.length} • Bookings: {loading ? "..." : bookings.length}
          </span>
        </div>
        <div style={subtitle}>Créer des créneaux / gérer les réservations.</div>

        <div style={{ marginTop: 12, display: "grid", gap: 10 }}>
          {error && <div style={alert("error")}>Erreur: {error}</div>}
          {msg && <div style={alert("success")}>{msg}</div>}
        </div>
      </div>

      {/* ---- Créer un créneau ---- */}
      <div style={card}>
        <h4 style={{ marginTop: 0 }}>Créer un créneau</h4>

        <form onSubmit={createSlot} style={{ display: "grid", gap: 12, maxWidth: 520 }}>
          <label style={label}>
            Date et Heure 
            <input
              style={input}
              value={slotDatetime}
              onChange={(e) => setSlotDatetime(e.target.value)}
              placeholder="ex: 2026-03-05 10:00"
              required
            />
          </label>

          <label style={label}>
            Capacité
            <input
              style={input}
              type="number"
              min="1"
              value={slotCapacity}
              onChange={(e) => setSlotCapacity(e.target.value)}
              required
            />
          </label>

          <div style={{ display: "flex", gap: 10 }}>
            <button style={btn("primary")} disabled={creatingSlot}>
              {creatingSlot ? "Création..." : "Créer"}
            </button>
            <button
              type="button"
              style={btn("ghost")}
              disabled={creatingSlot}
              onClick={() => {
                setSlotDatetime("");
                setSlotCapacity(1);
                setError(null);
                setMsg(null);
              }}
            >
              Effacer
            </button>
          </div>
        </form>
      </div>

      {/* ---- Liste créneaux ---- */}
      <div style={card}>
        <div style={titleRow}>
          <h4 style={{ margin: 0 }}>Créneaux</h4>
          {loadingSlots ? (
            <span style={{ fontSize: 12, color: "#6b7280" }}>Chargement...</span>
          ) : (
            <span style={{ fontSize: 12, color: "#6b7280" }}>Total: {slots.length}</span>
          )}
        </div>

        {!loadingSlots && slots.length === 0 && (
          <div style={{ marginTop: 10, color: "#6b7280" }}>Aucun créneau.</div>
        )}

        {!loadingSlots && slots.length > 0 && (
          <div style={{ marginTop: 12, ...tableWrap }}>
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

      {/* ---- Réservations ---- */}
      <div style={card}>
        <div style={titleRow}>
          <h4 style={{ margin: 0 }}>Réservations</h4>
          {loading ? (
            <span style={{ fontSize: 12, color: "#6b7280" }}>Chargement...</span>
          ) : (
            <span style={{ fontSize: 12, color: "#6b7280" }}>Total: {bookings.length}</span>
          )}
        </div>

        {!loading && bookings.length === 0 && (
          <div style={{ marginTop: 10, color: "#6b7280" }}>Aucune réservation.</div>
        )}

        {!loading && bookings.length > 0 && (
          <div style={{ marginTop: 12, ...tableWrap }}>
            <table style={table}>
              <thead>
                <tr>
                  <th style={th}>ID</th>
                  <th style={th}>Étudiant</th>
                  <th style={th}>CNE</th>
                  <th style={th}>Créneau</th>
                  <th style={th}>Motif</th>
                  <th style={th}>Statut</th>
                  <th style={th}>Action</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b, idx) => (
                  <tr key={b.id} style={{ background: idx % 2 === 0 ? "#ffffff" : "#fcfcfd" }}>
                    <td style={td}>{b.id}</td>
                    <td style={td}>{b.student_name}</td>
                    <td style={td}>{b.student_id}</td>
                    <td style={td}>
                      {b.slot_datetime} <span style={{ color: "#6b7280" }}>slot N° {b.slot_id}</span>
                    </td>
                    <td style={td}>{b.reason}</td>
                    <td style={td}>
                      <span style={statusBadge(b.status)}>{b.status}</span>
                    </td>
                    <td style={td}>
                      <select
                        style={select}
                        value={b.status}
                        onChange={(e) => changeStatus(b.id, e.target.value)}
                      >
                        {allowed.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
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