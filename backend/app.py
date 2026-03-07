from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3

app = Flask(__name__)
CORS(app)

DB_NAME = "queuebuddy.db"

def get_db():
    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row  
    return conn

def init_db():
    conn = get_db()
    cur = conn.cursor()

    cur.execute("""
    CREATE TABLE IF NOT EXISTS slots (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        datetime TEXT NOT NULL,
        capacity INTEGER NOT NULL
    )
    """)

    cur.execute("""
    CREATE TABLE IF NOT EXISTS bookings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        slot_id INTEGER NOT NULL,
        student_name TEXT NOT NULL,
        student_id TEXT NOT NULL,
        reason TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending',
        FOREIGN KEY(slot_id) REFERENCES slots(id)
    )
    """)

    conn.commit()
    conn.close()

init_db()

@app.get("/api/slots")
def get_slots():
    conn = get_db()
    rows = conn.execute("SELECT * FROM slots ORDER BY datetime ASC").fetchall()
    conn.close()
    slots = [dict(r) for r in rows]
    return jsonify(slots), 200

@app.post("/api/slots")
def create_slot():
    data = request.get_json(silent=True) or {}
    date = data.get("datetime")
    capacite = data.get("capacity")

    if not date or capacite is None:
        return jsonify({"error": "datetime et capacity sont obligatoires"}), 400

    try:
        capacite = int(capacite)
        if capacite <= 0:
            return jsonify({"error": "capacity doit être > 0"}), 400
    except:
        return jsonify({"error": "capacity doit être un entier"}), 400

    conn = get_db()
    cur = conn.cursor()
    cur.execute("INSERT INTO slots(datetime, capacity) VALUES (?, ?)", (date, capacite))
    conn.commit()
    new_id = cur.lastrowid
    conn.close()

    return jsonify({"id": new_id, "datetime": date, "capacity": capacite}), 201


@app.post("/api/bookings")
def create_booking():
    data = request.get_json(silent=True) or {}
    slot_id = data.get("slot_id")
    student_name = data.get("student_name")
    student_id = data.get("student_id")
    reason = data.get("reason")

    if not slot_id or not student_name or not student_id or not reason:
        return jsonify({"error": "slot_id, student_name, student_id, reason sont obligatoires"}), 400

    try:
        slot_id = int(slot_id)
    except:
        return jsonify({"error": "slot_id doit être un entier"}), 400

    conn = get_db()

    slot = conn.execute("SELECT * FROM slots WHERE id = ?", (slot_id,)).fetchone()
    if not slot:
        conn.close()
        return jsonify({"error": "Créneau introuvable"}), 404

    existing = conn.execute("""
        SELECT id FROM bookings
        WHERE slot_id = ? AND student_id = ?
    """, (slot_id, student_id)).fetchone()

    if existing:
        conn.close()
        return jsonify({"error": "Vous avez déjà réservé ce créneau"}), 400

    count_row = conn.execute("""
        SELECT COUNT(*) AS c FROM bookings WHERE slot_id = ?
    """, (slot_id,)).fetchone()

    current = count_row["c"]
    capacity = slot["capacity"]

    if current >= capacity:
        conn.close()
        return jsonify({"error": "Créneau complet"}), 400

    cur = conn.cursor()
    cur.execute("""
        INSERT INTO bookings(slot_id, student_name, student_id, reason, status)
        VALUES (?, ?, ?, ?, 'pending')
    """, (slot_id, student_name, student_id, reason))
    conn.commit()
    new_id = cur.lastrowid
    conn.close()

    return jsonify({
        "id": new_id,
        "slot_id": slot_id,
        "student_name": student_name,
        "student_id": student_id,
        "reason": reason,
        "status": "pending"
    }), 201


@app.get("/api/bookings")
def get_bookings():
    conn = get_db()
    rows = conn.execute("""
        SELECT b.*, s.datetime as slot_datetime
        FROM bookings b
        JOIN slots s ON s.id = b.slot_id
        ORDER BY b.id DESC
    """).fetchall()
    conn.close()
    return jsonify([dict(r) for r in rows]), 200


@app.patch("/api/bookings/<int:booking_id>")
def update_booking_status(booking_id):
    data = request.get_json(silent=True) or {}
    status = data.get("status")

    allowed = ["pending", "confirmed", "done", "canceled"]
    if status not in allowed:
        return jsonify({"error": f"status invalide. Autorisés: {allowed}"}), 400

    conn = get_db()
    row = conn.execute("SELECT * FROM bookings WHERE id = ?", (booking_id,)).fetchone()
    if not row:
        conn.close()
        return jsonify({"error": "Réservation introuvable"}), 404

    conn.execute("UPDATE bookings SET status = ? WHERE id = ?", (status, booking_id))
    conn.commit()
    conn.close()

    return jsonify({"id": booking_id, "status": status}), 200


if __name__ == "__main__":
    app.run(debug=True)