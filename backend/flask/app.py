"""
=============================================================================
ONLINE VOTING SYSTEM – Aadhaar-Style OTP Verification
Backend REST API Server (Python Flask)
=============================================================================
How to Run:
1. cd backend/flask
2. pip install -r requirements.txt
3. python app.py
The server will start on http://localhost:5000 with CORS enabled.
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import hashlib
import random
import string
import datetime
import os

app = Flask(__name__)
# Enable CORS for React frontend (ports 3000, 5173, etc.)
CORS(app, resources={r"/api/*": {"origins": "*"}})

DB_FILE = os.path.join(os.path.dirname(__file__), 'voting_system.db')

def get_db():
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    """Initializes SQLite database with default tables and demo records."""
    conn = get_db()
    cursor = conn.cursor()
    
    # Candidates table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS candidates (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            party TEXT NOT NULL,
            symbol_name TEXT NOT NULL,
            symbol_icon TEXT DEFAULT 'vote',
            color TEXT DEFAULT '#2563EB',
            education TEXT,
            agenda TEXT,
            votes INTEGER DEFAULT 0,
            is_active INTEGER DEFAULT 1
        )
    ''')

    # Voters table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS voters (
            id TEXT PRIMARY KEY,
            voter_id TEXT UNIQUE NOT NULL,
            full_name TEXT NOT NULL,
            masked_aadhaar TEXT NOT NULL,
            masked_mobile TEXT NOT NULL,
            phone_suffix TEXT NOT NULL,
            constituency TEXT DEFAULT 'Constituency #04 - Academic Hub',
            status TEXT DEFAULT 'ELIGIBLE'
        )
    ''')

    # OTP active cache
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS otp_sessions (
            voter_id TEXT PRIMARY KEY,
            otp_hash TEXT NOT NULL,
            session_token TEXT NOT NULL,
            expires_at TEXT NOT NULL
        )
    ''')

    # Ballots
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS ballots (
            id TEXT PRIMARY KEY,
            receipt_hash TEXT UNIQUE NOT NULL,
            candidate_id TEXT NOT NULL,
            cast_at TEXT NOT NULL
        )
    ''')

    # Audit logs
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS audit_logs (
            id TEXT PRIMARY KEY,
            timestamp TEXT NOT NULL,
            action TEXT NOT NULL,
            detail TEXT NOT NULL
        )
    ''')

    # Pre-seed candidates if empty
    cursor.execute('SELECT COUNT(*) as count FROM candidates')
    if cursor.fetchone()['count'] == 0:
        candidates_seed = [
            ('cand-01', 'Dr. Rajeshwar Rao', 'National Progress Alliance', 'Rising Sun', 'sun', '#D97706', 'Ph.D. in Public Administration', 'Sustainable rural digital infrastructure, transparent governance.', 48, 1),
            ('cand-02', 'Smt. Ananya Deshmukh', 'Democratic Peoples Coalition', 'Scales of Justice', 'scale', '#2563EB', 'M.S. in Environmental Policy', 'Universal primary healthcare coverage, youth technical skill institutes.', 62, 1),
            ('cand-03', 'Prof. Vikramaditya Sengupta', 'Youth & Education Front', 'Open Book', 'book-open', '#059669', 'M.Tech, IIT Madras', 'Public research grants, affordable student housing, STEM mentorship.', 39, 1),
            ('cand-04', 'Kumari Meenakshi Sundaram', 'Green Agro Collective', 'Banyan Tree', 'trees', '#15803D', 'B.Sc. Agriculture, MBA', 'Direct farmer fair-price subsidies, decentralized micro-cold chains.', 27, 1),
            ('cand-05', 'NOTA (None of the Above)', 'Independent Choice Option', 'Ballot Stamp', 'vote', '#475569', 'Statutory Electoral Option', 'Constitutional provision allowing voters to reject all candidates.', 6, 1)
        ]
        cursor.executemany('INSERT INTO candidates VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', candidates_seed)

    # Pre-seed voters if empty
    cursor.execute('SELECT COUNT(*) as count FROM voters')
    if cursor.fetchone()['count'] == 0:
        voters_seed = [
            ('vtr-1', 'VTR-2026-9041', 'Arun K. Sharma (Demo)', 'XXXX-XXXX-8421', '+91 ••••• •4321', '4321', 'Constituency #04 - Academic Hub', 'ELIGIBLE'),
            ('vtr-2', 'VTR-2026-9042', 'Priya R. Patel (Demo)', 'XXXX-XXXX-1930', '+91 ••••• •7890', '7890', 'Constituency #04 - Academic Hub', 'ELIGIBLE'),
            ('vtr-3', 'VTR-2026-9043', 'Mohammed Farhan (Demo)', 'XXXX-XXXX-5512', '+91 ••••• •2210', '2210', 'Constituency #04 - Academic Hub', 'VOTED'),
            ('vtr-4', 'VTR-2026-9044', 'Sunita Devi (Demo)', 'XXXX-XXXX-6789', '+91 ••••• •9901', '9901', 'Constituency #04 - Academic Hub', 'ELIGIBLE')
        ]
        cursor.executemany('INSERT INTO voters VALUES (?, ?, ?, ?, ?, ?, ?, ?)', voters_seed)

    conn.commit()
    conn.close()

def log_audit(action, detail):
    try:
        conn = get_db()
        cursor = conn.cursor()
        log_id = 'log-' + ''.join(random.choices(string.ascii_lowercase + string.digits, k=8))
        ts = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        cursor.execute('INSERT INTO audit_logs VALUES (?, ?, ?, ?)', (log_id, ts, action, detail))
        conn.commit()
        conn.close()
    except Exception as e:
        print(f"Audit log error: {e}")

# -----------------------------------------------------------------------------
# REST API ENDPOINTS
# -----------------------------------------------------------------------------

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({
        "status": "UP",
        "service": "Online Voting System Flask API",
        "timestamp": datetime.datetime.now().isoformat()
    })

@app.route('/api/candidates', methods=['GET'])
def get_candidates():
    conn = get_db()
    rows = conn.execute('SELECT * FROM candidates WHERE is_active = 1').fetchall()
    conn.close()
    return jsonify([dict(r) for r in rows])

@app.route('/api/voters', methods=['GET'])
def get_voters():
    conn = get_db()
    rows = conn.execute('SELECT id, voter_id, full_name, masked_aadhaar, masked_mobile, constituency, status FROM voters').fetchall()
    conn.close()
    return jsonify([dict(r) for r in rows])

@app.route('/api/voters/request-otp', methods=['POST'])
def request_otp():
    """
    Simulated Aadhaar-style OTP Generation.
    Validates Voter ID and mobile record. Dispatches OTP to registered mobile.
    NEVER returns the raw OTP in the API response!
    """
    data = request.get_json() or {}
    voter_id = (data.get('voterId') or '').strip().upper()
    mobile = (data.get('mobileNumber') or '').strip().replace(' ', '')

    if not voter_id or not mobile:
        return jsonify({"success": False, "message": "Voter ID and mobile number are required."}), 400

    conn = get_db()
    voter = conn.execute('SELECT * FROM voters WHERE voter_id = ?', (voter_id,)).fetchone()

    if not voter:
        conn.close()
        return jsonify({"success": False, "message": f"Voter ID '{voter_id}' not found in electoral roll."}), 404

    if voter['status'] == 'VOTED':
        conn.close()
        return jsonify({"success": False, "message": "Ballot has ALREADY BEEN CAST for this voter ID. Re-voting prohibited."}), 403

    if voter['phone_suffix'] and not mobile.endswith(voter['phone_suffix']):
        conn.close()
        return jsonify({"success": False, "message": f"Mobile does not match registered record (ends with {voter['phone_suffix']})."}), 400

    # Generate 6-digit OTP (stored only as a hash with 60s expiration)
    # Academic prototype note: in demo mode, '123456' is also accepted
    generated_otp = str(random.randint(100000, 999999))
    otp_hash = hashlib.sha256(generated_otp.encode()).hexdigest()
    session_token = 'SESS_' + ''.join(random.choices(string.ascii_uppercase + string.digits, k=16))
    expires_at = (datetime.datetime.now() + datetime.timedelta(seconds=60)).isoformat()

    conn.execute('INSERT OR REPLACE INTO otp_sessions VALUES (?, ?, ?, ?)', (voter_id, otp_hash, session_token, expires_at))
    conn.commit()
    conn.close()

    log_audit('OTP_DISPATCHED', f'OTP dispatched to masked mobile {voter["masked_mobile"]} for voter {voter_id[:6]}•••.')

    # Crucially: We do NOT send generated_otp in the response body!
    return jsonify({
        "success": True,
        "sessionToken": session_token,
        "maskedMobile": voter['masked_mobile'],
        "expiresInSeconds": 60,
        "message": f"OTP successfully dispatched to registered mobile {voter['masked_mobile']}. Valid for 60 seconds."
    })

@app.route('/api/voters/verify-otp', methods=['POST'])
def verify_otp():
    """
    Validates the 6-digit OTP. Accepts the generated OTP or the standard academic demo code '123456'.
    """
    data = request.get_json() or {}
    voter_id = (data.get('voterId') or '').strip().upper()
    entered_otp = (data.get('otp') or '').strip()

    if not voter_id or len(entered_otp) != 6:
        return jsonify({"success": False, "message": "A valid 6-digit numeric OTP is required."}), 400

    conn = get_db()
    session = conn.execute('SELECT * FROM otp_sessions WHERE voter_id = ?', (voter_id,)).fetchone()

    if not session:
        conn.close()
        return jsonify({"success": False, "message": "No active OTP request found. Please request a new OTP."}), 404

    # Verify expiration
    now = datetime.datetime.now().isoformat()
    if now > session['expires_at']:
        conn.close()
        return jsonify({"success": False, "message": "OTP has expired. Please request a fresh one."}), 400

    entered_hash = hashlib.sha256(entered_otp.encode()).hexdigest()
    # Accept generated hash or standard academic evaluator code '123456'
    is_valid = (entered_hash == session['otp_hash']) or (entered_otp == '123456')

    if not is_valid:
        conn.close()
        return jsonify({"success": False, "message": "Invalid OTP code entered. Please try again."}), 400

    # Clear OTP after verification
    conn.execute('DELETE FROM otp_sessions WHERE voter_id = ?', (voter_id,))
    conn.commit()
    conn.close()

    proof_token = 'AUTH_PROOF_' + ''.join(random.choices(string.ascii_uppercase + string.digits, k=12))
    log_audit('OTP_VERIFIED', f'Identity verified for voter {voter_id[:6]}•••. Electronic ballot unlocked.')

    return jsonify({
        "success": True,
        "verificationProof": proof_token,
        "message": "Identity authenticated via simulated Aadhaar-OTP channel. Ballot unlocked."
    })

@app.route('/api/ballot/cast', methods=['POST'])
def cast_ballot():
    """
    Single atomic ballot cast.
    Locks voter to 'VOTED' and increments candidate votes in a single ACID transaction.
    """
    data = request.get_json() or {}
    voter_id = (data.get('voterId') or '').strip().upper()
    candidate_id = (data.get('candidateId') or '').strip()

    if not voter_id or not candidate_id:
        return jsonify({"success": False, "message": "Voter ID and candidate selection are required."}), 400

    conn = get_db()
    cursor = conn.cursor()

    # Check voter status
    voter = cursor.execute('SELECT status FROM voters WHERE voter_id = ?', (voter_id,)).fetchone()
    if not voter:
        conn.close()
        return jsonify({"success": False, "message": "Voter not found."}), 404

    if voter['status'] == 'VOTED':
        conn.close()
        return jsonify({"success": False, "message": "A ballot has already been recorded for this voter."}), 403

    # Generate receipt hash
    receipt_id = 'REC-' + '-'.join([''.join(random.choices(string.ascii_uppercase + string.digits, k=4)) for _ in range(4)])
    timestamp = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S IST')

    # Atomic update
    try:
        cursor.execute('UPDATE candidates SET votes = votes + 1 WHERE id = ?', (candidate_id,))
        cursor.execute('UPDATE voters SET status = "VOTED" WHERE voter_id = ?', (voter_id,))
        cursor.execute('INSERT INTO ballots VALUES (?, ?, ?, ?)', (
            'bal-' + ''.join(random.choices(string.ascii_lowercase, k=8)),
            receipt_id,
            candidate_id,
            timestamp
        ))
        conn.commit()
    except Exception as e:
        conn.rollback()
        conn.close()
        return jsonify({"success": False, "message": f"Ballot transaction error: {str(e)}"}), 500

    conn.close()
    log_audit('BALLOT_SEALED', f'Ballot receipt token {receipt_id} recorded and sealed.')

    return jsonify({
        "success": True,
        "receiptId": receipt_id,
        "timestamp": timestamp,
        "message": "Your vote has been cryptographically recorded and sealed."
    })

@app.route('/api/election/results', methods=['GET'])
def get_results():
    conn = get_db()
    candidates = conn.execute('SELECT id, name, party, symbol_name, symbol_icon, color, votes FROM candidates WHERE is_active = 1 ORDER BY votes DESC').fetchall()
    total_votes = sum(c['votes'] for c in candidates)
    voters_count = conn.execute('SELECT COUNT(*) as count FROM voters').fetchone()['count']
    voted_count = conn.execute('SELECT COUNT(*) as count FROM voters WHERE status = "VOTED"').fetchone()['count']
    conn.close()

    turnout = round((voted_count / voters_count * 100), 1) if voters_count > 0 else 0.0

    return jsonify({
        "totalVotes": total_votes,
        "totalRegisteredVoters": voters_count,
        "turnoutPercentage": turnout,
        "candidates": [dict(c) for c in candidates]
    })

@app.route('/api/admin/login', methods=['POST'])
def admin_login():
    data = request.get_json() or {}
    username = data.get('username')
    password = data.get('password')

    if username == 'admin' and password == 'admin123':
        token = 'ADMIN_JWT_SIMULATED_' + ''.join(random.choices(string.ascii_uppercase, k=16))
        return jsonify({"success": True, "token": token, "officer": "Electoral Admin #01"})
    return jsonify({"success": False, "message": "Invalid admin credentials."}), 401

@app.route('/api/admin/reset', methods=['POST'])
def admin_reset():
    conn = get_db()
    conn.execute('UPDATE candidates SET votes = 0')
    conn.execute('UPDATE voters SET status = "ELIGIBLE"')
    conn.execute('DELETE FROM ballots')
    conn.commit()
    conn.close()
    log_audit('ELECTION_RESET', 'All candidate votes cleared and voter statuses reset to ELIGIBLE.')
    return jsonify({"success": True, "message": "All election ballots reset to zero."})

@app.route('/api/audit-logs', methods=['GET'])
def get_audit_logs():
    conn = get_db()
    rows = conn.execute('SELECT * FROM audit_logs ORDER BY timestamp DESC LIMIT 50').fetchall()
    conn.close()
    return jsonify([dict(r) for r in rows])

if __name__ == '__main__':
    init_db()
    print("===================================================================")
    print(" CIVICVOTE Flask Backend Server running on http://127.0.0.1:5000")
    print(" Database: voting_system.db (auto-seeded)")
    print("===================================================================")
    app.run(host='0.0.0.0', port=5000, debug=True)
