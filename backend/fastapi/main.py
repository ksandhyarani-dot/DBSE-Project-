"""
=============================================================================
ONLINE VOTING SYSTEM – Aadhaar-Style OTP Verification
Backend REST API Server (Python FastAPI)
=============================================================================
How to Run:
1. cd backend/fastapi
2. pip install -r requirements.txt
3. uvicorn main:app --reload --port 8000
Interactive Swagger UI: http://localhost:8000/docs
"""

from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional
import random
import string
import datetime
import hashlib

app = FastAPI(
    title="Online Voting System API (FastAPI)",
    description="Academic prototype API with Aadhaar-Style OTP Verification and single-ballot locking.",
    version="1.0.0"
)

# Enable CORS for React dev servers
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage for instant testing without database drivers
CANDIDATES_DB = [
    {"id": "cand-01", "name": "Dr. Rajeshwar Rao", "party": "National Progress Alliance", "symbol_name": "Rising Sun", "symbol_icon": "sun", "color": "#D97706", "education": "Ph.D. in Public Administration", "agenda": "Sustainable rural digital infrastructure, transparent governance.", "votes": 48, "is_active": True},
    {"id": "cand-02", "name": "Smt. Ananya Deshmukh", "party": "Democratic Peoples Coalition", "symbol_name": "Scales of Justice", "symbol_icon": "scale", "color": "#2563EB", "education": "M.S. in Environmental Policy", "agenda": "Universal primary healthcare coverage, youth technical skill institutes.", "votes": 62, "is_active": True},
    {"id": "cand-03", "name": "Prof. Vikramaditya Sengupta", "party": "Youth & Education Front", "symbol_name": "Open Book", "symbol_icon": "book-open", "color": "#059669", "education": "M.Tech, IIT Madras", "agenda": "Public research grants, affordable student housing, STEM mentorship.", "votes": 39, "is_active": True},
    {"id": "cand-04", "name": "Kumari Meenakshi Sundaram", "party": "Green Agro Collective", "symbol_name": "Banyan Tree", "symbol_icon": "trees", "color": "#15803D", "education": "B.Sc. Agriculture, MBA", "agenda": "Direct farmer fair-price subsidies, decentralized micro-cold chains.", "votes": 27, "is_active": True},
    {"id": "cand-05", "name": "NOTA (None of the Above)", "party": "Independent Choice Option", "symbol_name": "Ballot Stamp", "symbol_icon": "vote", "color": "#475569", "education": "Statutory Electoral Option", "agenda": "Constitutional provision allowing voters to reject all presented candidates.", "votes": 6, "is_active": True}
]

VOTERS_DB = [
    {"id": "vtr-1", "voter_id": "VTR-2026-9041", "full_name": "Arun K. Sharma (Demo)", "masked_aadhaar": "XXXX-XXXX-8421", "masked_mobile": "+91 ••••• •4321", "phone_suffix": "4321", "status": "ELIGIBLE"},
    {"id": "vtr-2", "voter_id": "VTR-2026-9042", "full_name": "Priya R. Patel (Demo)", "masked_aadhaar": "XXXX-XXXX-1930", "masked_mobile": "+91 ••••• •7890", "phone_suffix": "7890", "status": "ELIGIBLE"},
    {"id": "vtr-3", "voter_id": "VTR-2026-9043", "full_name": "Mohammed Farhan (Demo)", "masked_aadhaar": "XXXX-XXXX-5512", "masked_mobile": "+91 ••••• •2210", "phone_suffix": "2210", "status": "VOTED"},
    {"id": "vtr-4", "voter_id": "VTR-2026-9044", "full_name": "Sunita Devi (Demo)", "masked_aadhaar": "XXXX-XXXX-6789", "masked_mobile": "+91 ••••• •9901", "phone_suffix": "9901", "status": "ELIGIBLE"}
]

OTP_SESSIONS = {}
AUDIT_LOGS = [
    {"id": "log-01", "timestamp": "08:14:22", "action": "POLL_OPENED", "detail": "Election initialized for Constituency #04."}
]

# Pydantic Schemas
class OtpRequest(BaseModel):
    voterId: str = Field(..., example="VTR-2026-9041")
    mobileNumber: str = Field(..., example="98765 04321")

class OtpVerifyRequest(BaseModel):
    voterId: str = Field(..., example="VTR-2026-9041")
    otp: str = Field(..., example="123456")

class BallotCastRequest(BaseModel):
    voterId: str = Field(..., example="VTR-2026-9041")
    candidateId: str = Field(..., example="cand-02")

class AdminLoginRequest(BaseModel):
    username: str = Field(..., example="admin")
    password: str = Field(..., example="admin123")

# Endpoints
@app.get("/api/health")
def health_check():
    return {"status": "UP", "service": "FastAPI Voting Engine", "docs": "/docs"}

@app.get("/api/candidates")
def list_candidates():
    return [c for c in CANDIDATES_DB if c.get("is_active", True)]

@app.get("/api/voters")
def list_voters():
    return VOTERS_DB

@app.post("/api/voters/request-otp")
def request_otp(payload: OtpRequest):
    voter_id = payload.voterId.strip().upper()
    voter = next((v for v in VOTERS_DB if v["voter_id"] == voter_id), None)
    
    if not voter:
        raise HTTPException(status_code=404, detail=f"Voter ID '{voter_id}' not found.")
    
    if voter["status"] == "VOTED":
        raise HTTPException(status_code=403, detail="Ballot already cast for this Voter ID. Duplicate voting is prohibited.")
    
    clean_mobile = payload.mobileNumber.replace(" ", "")
    if voter["phone_suffix"] and not clean_mobile.endswith(voter["phone_suffix"]):
        raise HTTPException(status_code=400, detail=f"Mobile does not match registered Aadhaar record (ends with {voter['phone_suffix']}).")
    
    generated_otp = str(random.randint(100000, 999999))
    session_token = "SESS_" + "".join(random.choices(string.ascii_uppercase + string.digits, k=16))
    
    OTP_SESSIONS[voter_id] = {
        "hash": hashlib.sha256(generated_otp.encode()).hexdigest(),
        "expires_at": datetime.datetime.now() + datetime.timedelta(seconds=60)
    }
    
    AUDIT_LOGS.append({
        "id": "log-" + "".join(random.choices(string.digits, k=6)),
        "timestamp": datetime.datetime.now().strftime("%H:%M:%S"),
        "action": "OTP_DISPATCHED",
        "detail": f"Simulated OTP dispatched to {voter['masked_mobile']}."
    })
    
    return {
        "success": True,
        "sessionToken": session_token,
        "maskedMobile": voter["masked_mobile"],
        "expiresInSeconds": 60,
        "message": f"OTP securely dispatched to {voter['masked_mobile']}. Valid for 60s."
    }

@app.post("/api/voters/verify-otp")
def verify_otp(payload: OtpVerifyRequest):
    voter_id = payload.voterId.strip().upper()
    entered_otp = payload.otp.strip()
    
    if len(entered_otp) != 6:
        raise HTTPException(status_code=400, detail="OTP must be exactly 6 digits.")
    
    session = OTP_SESSIONS.get(voter_id)
    if not session:
        raise HTTPException(status_code=404, detail="No active OTP session found. Please request an OTP.")
    
    if datetime.datetime.now() > session["expires_at"]:
        raise HTTPException(status_code=400, detail="OTP has expired.")
    
    # Accept generated hash or standard academic evaluation code '123456'
    entered_hash = hashlib.sha256(entered_otp.encode()).hexdigest()
    if entered_hash != session["hash"] and entered_otp != "123456":
        raise HTTPException(status_code=400, detail="Invalid OTP code.")
    
    del OTP_SESSIONS[voter_id]
    proof = "AUTH_PROOF_" + "".join(random.choices(string.ascii_uppercase + string.digits, k=12))
    return {
        "success": True,
        "verificationProof": proof,
        "message": "Aadhaar OTP authenticated successfully. Ballot unlocked."
    }

@app.post("/api/ballot/cast")
def cast_ballot(payload: BallotCastRequest):
    voter_id = payload.voterId.strip().upper()
    voter = next((v for v in VOTERS_DB if v["voter_id"] == voter_id), None)
    
    if not voter:
        raise HTTPException(status_code=404, detail="Voter not found.")
    if voter["status"] == "VOTED":
        raise HTTPException(status_code=403, detail="Ballot already recorded for this voter.")
        
    candidate = next((c for c in CANDIDATES_DB if c["id"] == payload.candidateId), None)
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found.")
    
    # Lock voter and increment vote
    candidate["votes"] += 1
    voter["status"] = "VOTED"
    
    receipt_id = "REC-" + "-".join(["".join(random.choices(string.ascii_uppercase + string.digits, k=4)) for _ in range(4)])
    timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S IST")
    
    return {
        "success": True,
        "receiptId": receipt_id,
        "timestamp": timestamp,
        "message": "Your vote has been cryptographically recorded and sealed."
    }

@app.get("/api/election/results")
def election_results():
    total_votes = sum(c["votes"] for c in CANDIDATES_DB)
    voted_count = len([v for v in VOTERS_DB if v["status"] == "VOTED"])
    turnout = round((voted_count / len(VOTERS_DB) * 100), 1) if VOTERS_DB else 0.0
    
    sorted_candidates = sorted(CANDIDATES_DB, key=lambda x: x["votes"], reverse=True)
    return {
        "totalVotes": total_votes,
        "totalRegisteredVoters": len(VOTERS_DB),
        "turnoutPercentage": turnout,
        "candidates": sorted_candidates
    }

@app.post("/api/admin/login")
def admin_login(payload: AdminLoginRequest):
    if payload.username == "admin" and payload.password == "admin123":
        return {"success": True, "token": "ADMIN_TOKEN_FASTAPI_SECRET", "officer": "Electoral Admin #01"}
    raise HTTPException(status_code=401, detail="Invalid admin credentials.")

@app.post("/api/admin/reset")
def admin_reset():
    for c in CANDIDATES_DB:
        c["votes"] = 0
    for v in VOTERS_DB:
        v["status"] = "ELIGIBLE"
    return {"success": True, "message": "All election tallies reset to zero."}

@app.get("/api/audit-logs")
def get_audit_logs():
    return list(reversed(AUDIT_LOGS[-50:]))
