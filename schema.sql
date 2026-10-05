-- ====================================================================
-- DATABASE SCHEMA: ONLINE VOTING SYSTEM – Aadhaar-Style OTP Verification
-- Compatible with MySQL 8.0+ and SQLite 3
-- ====================================================================

-- 1. Table: candidates
CREATE TABLE IF NOT EXISTS candidates (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    party VARCHAR(150) NOT NULL,
    symbol_name VARCHAR(100) NOT NULL,
    symbol_icon VARCHAR(50) DEFAULT 'vote',
    color VARCHAR(20) DEFAULT '#2563EB',
    education VARCHAR(200),
    agenda TEXT,
    votes INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Table: voters (Electoral Roll)
-- Note: Aadhaar numbers are stored only as non-reversible masked references or hashes
CREATE TABLE IF NOT EXISTS voters (
    id VARCHAR(36) PRIMARY KEY,
    voter_id VARCHAR(50) UNIQUE NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    masked_aadhaar VARCHAR(30) NOT NULL,
    masked_mobile VARCHAR(30) NOT NULL,
    phone_suffix VARCHAR(10) NOT NULL,
    constituency VARCHAR(150) DEFAULT 'Constituency #04 - Academic Hub',
    status VARCHAR(20) DEFAULT 'ELIGIBLE', -- 'ELIGIBLE' or 'VOTED'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Table: otp_sessions
-- Tracks transient verification sessions (OTPs expire in 60s)
CREATE TABLE IF NOT EXISTS otp_sessions (
    id VARCHAR(36) PRIMARY KEY,
    voter_id VARCHAR(50) NOT NULL,
    otp_hash VARCHAR(255) NOT NULL,
    session_token VARCHAR(100) UNIQUE NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (voter_id) REFERENCES voters(voter_id) ON DELETE CASCADE
);

-- 4. Table: ballots (Cryptographically Anonymized Vote Records)
-- The ballot record stores the candidate and timestamp with a hash proof, decoupled from voter name
CREATE TABLE IF NOT EXISTS ballots (
    id VARCHAR(36) PRIMARY KEY,
    receipt_hash VARCHAR(100) UNIQUE NOT NULL,
    candidate_id VARCHAR(36) NOT NULL,
    constituency VARCHAR(150) NOT NULL,
    cast_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (candidate_id) REFERENCES candidates(id)
);

-- 5. Table: audit_logs (Tamper-Evident Event Logging)
CREATE TABLE IF NOT EXISTS audit_logs (
    id VARCHAR(36) PRIMARY KEY,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    action VARCHAR(50) NOT NULL,
    detail TEXT NOT NULL
);

-- 6. Table: admin_users
CREATE TABLE IF NOT EXISTS admin_users (
    id VARCHAR(36) PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role VARCHAR(50) DEFAULT 'ELECTION_OFFICER'
);

-- ====================================================================
-- SEED DATA (Academic Demo Preset)
-- ====================================================================

-- Insert Sample Candidates
INSERT INTO candidates (id, name, party, symbol_name, symbol_icon, color, education, agenda, votes, is_active)
VALUES 
('cand-01', 'Dr. Rajeshwar Rao', 'National Progress Alliance', 'Rising Sun', 'sun', '#D97706', 'Ph.D. in Public Administration', 'Sustainable rural digital infrastructure, transparent governance, and clean energy expansion.', 48, TRUE),
('cand-02', 'Smt. Ananya Deshmukh', 'Democratic Peoples Coalition', 'Scales of Justice', 'scale', '#2563EB', 'M.S. in Environmental Policy', 'Universal primary healthcare coverage, youth technical skill institutes, and judicial modernization.', 62, TRUE),
('cand-03', 'Prof. Vikramaditya Sengupta', 'Youth & Education Front', 'Open Book', 'book-open', '#059669', 'M.Tech, IIT Madras', 'Public research grants, affordable student housing, and rural STEM mentorship programs.', 39, TRUE),
('cand-04', 'Kumari Meenakshi Sundaram', 'Green Agro Collective', 'Banyan Tree', 'trees', '#15803D', 'B.Sc. Agriculture, MBA', 'Direct farmer fair-price subsidies, decentralized micro-cold chains, and organic soil regeneration.', 27, TRUE),
('cand-05', 'NOTA (None of the Above)', 'Independent Choice Option', 'Ballot Stamp', 'vote', '#475569', 'Statutory Electoral Option', 'Official constitutional provision allowing voters to reject all presented candidates.', 6, TRUE);

-- Insert Sample Registered Voters (Masked Demo Data)
INSERT INTO voters (id, voter_id, full_name, masked_aadhaar, masked_mobile, phone_suffix, constituency, status)
VALUES
('vtr-1', 'VTR-2026-9041', 'Arun K. Sharma (Demo)', 'XXXX-XXXX-8421', '+91 ••••• •4321', '4321', 'Constituency #04 - Academic Hub', 'ELIGIBLE'),
('vtr-2', 'VTR-2026-9042', 'Priya R. Patel (Demo)', 'XXXX-XXXX-1930', '+91 ••••• •7890', '7890', 'Constituency #04 - Academic Hub', 'ELIGIBLE'),
('vtr-3', 'VTR-2026-9043', 'Mohammed Farhan (Demo)', 'XXXX-XXXX-5512', '+91 ••••• •2210', '2210', 'Constituency #04 - Academic Hub', 'VOTED'),
('vtr-4', 'VTR-2026-9044', 'Sunita Devi (Demo)', 'XXXX-XXXX-6789', '+91 ••••• •9901', '9901', 'Constituency #04 - Academic Hub', 'ELIGIBLE');

-- Insert Initial Audit Logs
INSERT INTO audit_logs (id, timestamp, action, detail)
VALUES
('log-01', CURRENT_TIMESTAMP, 'POLL_INITIALIZED', 'Central database initialized for Constituency #04.'),
('log-02', CURRENT_TIMESTAMP, 'ROLL_VERIFIED', 'Electoral roll integrity verified across 4 sample electors.');
