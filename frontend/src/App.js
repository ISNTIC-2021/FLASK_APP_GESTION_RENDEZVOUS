import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import Home from "./pages/Home";
import MyBookings from "./pages/MyBookings";
import Admin from "./pages/Admin";

export default function App() {
  const container = {
    maxWidth: 1000,
    margin: "0 auto",
    padding: 20,
    fontFamily: "Segoe UI, Arial, sans-serif",
  };

  const header = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  };

  const title = {
    margin: 0,
    fontSize: 22,
    fontWeight: 700,
    color: "#111827",
  };

  const nav = {
    display: "flex",
    gap: 10,
  };

  const linkStyle = {
    padding: "8px 14px",
    borderRadius: 10,
    textDecoration: "none",
    fontSize: 14,
    fontWeight: 600,
    border: "1px solid #e5e7eb",
  };

  const activeStyle = {
    backgroundColor: "#111827",
    color: "white",
    border: "1px solid #111827",
  };

  const inactiveStyle = {
    backgroundColor: "white",
    color: "#374151",
  };

  return (
    <BrowserRouter>
      <div style={container}>
        <div style={header}>
          <h2 style={title}>QueueBuddy</h2>

          <nav style={nav}>
            <NavLink
              to="/"
              end
              style={({ isActive }) =>
                isActive
                  ? { ...linkStyle, ...activeStyle }
                  : { ...linkStyle, ...inactiveStyle }
              }
            >
              Créneaux
            </NavLink>

            <NavLink
              to="/my-bookings"
              style={({ isActive }) =>
                isActive
                  ? { ...linkStyle, ...activeStyle }
                  : { ...linkStyle, ...inactiveStyle }
              }
            >
              Mes réservations
            </NavLink>

            <NavLink
              to="/admin"
              style={({ isActive }) =>
                isActive
                  ? { ...linkStyle, ...activeStyle }
                  : { ...linkStyle, ...inactiveStyle }
              }
            >
              Admin
            </NavLink>
          </nav>
        </div>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}