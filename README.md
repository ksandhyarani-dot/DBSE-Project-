# ONLINE VOTING SYSTEM – Using Aadhaar-Style OTP Verification
## Academic Capstone & Research Prototype

A modern, secure, and production-grade frontend built with **React.js & Tailwind CSS**, engineered to demonstrate electronic voting integrity, simulated Aadhaar-style multi-factor OTP verification, single-ballot locking, tamper-evident cryptographic receipt generation, and real-time result tabulation.

---

### Important Academic & Security Notice
* **Academic Prototype:** This project is designed exclusively for educational evaluation, defense, and capstone presentation.
* **No Real Credentials:** No real Aadhaar numbers, personal phone numbers, or passwords are used, collected, or persisted.
* **Masked Security:** All OTP inputs and credentials are strictly masked (`••••••`). The system never prints or exposes OTP codes or plaintext passwords in the user interface.

---

## 📁 Project Directory Structure in VS Code

```text
online-voting-system/
├── package.json
├── vite.config.ts (or vite.config.js)
├── index.html
├── README.md
└── src/
    ├── App.js                   # Primary presentation & routing controller
    ├── App.jsx                  # Main voting workflow & state coordinator
    ├── main.jsx                 # React root DOM mount point
    ├── main.tsx                 # TypeScript entry point (if using TS)
    ├── index.css                # Global Tailwind CSS definitions
    ├── assets/
    │   └── images/              # Clean civic illustrations & emblems
    ├── components/
    │   ├── Navbar.jsx           # Clean 3-zone civic navigation header
    │   ├── Footer.jsx           # Institutional academic footer
    │   ├── AcademicDisclaimerBanner.jsx  # Security & educational disclaimer
    │   └── CandidateSymbolIcon.jsx       # SVG party emblem symbols (Sun, Scales, Book, Tree, etc.)
    ├── pages/
    │   ├── HomePage.jsx                 # Portal introduction, stats & workflow preview
    │   ├── VoterVerificationPage.jsx    # 2-step Aadhaar-style masked OTP authentication
    │   ├── CandidateSelectionPage.jsx   # Contesting candidate cards with single-choice lock
    │   ├── VoteConfirmationPage.jsx     # Pre-ballot sealing verification dialog
    │   ├── VoteSuccessPage.jsx          # Official digital receipt & verification token
    │   ├── ResultsPage.jsx              # Tabular & bar-chart live election analytics
    │   └── AdminDashboardPage.jsx       # Password-masked election authority console
    ├── services/
    │   ├── api.js                       # Network service (Flask API ready with mock fallback)
    │   ├── ElectionContext.jsx          # Centralized React Context state provider
    │   └── mockData.js                  # Sample electoral roll and candidate presets
    └── styles/
        └── custom.css                   # Custom animations and tabular typography
```

---

## 🚀 How to Run in VS Code

### Step 1: Open the Project in VS Code
1. Launch **Visual Studio Code**.
2. Go to **File → Open Folder...** and select this project folder.
3. Open the integrated terminal in VS Code using ``Ctrl + ` `` (or `Cmd + \`` on macOS).

### Step 2: Install Node Dependencies
Ensure you have **Node.js (v18 or higher)** installed on your machine. In the VS Code terminal, run:
```bash
npm install
```

### Step 3: Start the Development Server
```bash
npm run dev
```

The terminal will display your local server address (usually `http://localhost:3000` or `http://localhost:5173`).
Hold `Ctrl` and click the URL to open the voting system in your browser!

---

## 🗳️ Voting Workflow Demonstration Steps

1. **Home Page:**
   * Review election parameters, constituency details, and active candidates.
   * Click **"Start Voting Flow"**.

2. **Voter Details & OTP Verification:**
   * Enter a sample Voter ID (e.g. `VTR-2026-9041`) and registered phone (e.g. `98765 04321`), or click the **"Quick Fill Demo Voter"** button.
   * Click **"Send Aadhaar-Style OTP"**.
   * Enter the masked 6-digit OTP in the input boxes (e.g. `1 2 3 4 5 6`). Notice that numbers are masked and actual OTP values are never exposed.
   * Click **"Verify OTP & Unlock Ballot"**.

3. **Candidate Selection:**
   * Inspect the contesting candidates, party platforms, and official symbols.
   * Select your desired candidate. The system enforces strict single-choice selection.
   * Click **"Cast Vote →"**.

4. **Vote Confirmation:**
   * Review your chosen candidate and read the irreversible submission notice.
   * Click **"Confirm & Submit Vote"**.

5. **Vote Submitted & Receipt:**
   * Receive a tamper-evident digital receipt with an encrypted transaction hash (e.g. `REC-9A2F-81D2-B3C4`), masked voter reference, and timestamp.
   * Click **"View Live Election Results"** or **"Print Receipt"**.

6. **Results & Admin Console:**
   * View live percentage distribution and bar charts on the **Live Results** page.
   * Access the **Admin Console** using username `admin` and password `admin123` (password is strictly masked with no credentials exposed).
   * Manage candidates, view the masked voter registry, inspect the live audit log, or reset demo data for the next demonstration.

---

## 🔌 Backend Servers & Postman Integration

We provide 3 complete backend implementations and a pre-configured Postman Collection:

### 1. Python Flask Backend (`backend/flask/`)
* **Framework:** Python Flask + SQLite / MySQL
* **File:** `backend/flask/app.py`
* **How to run in VS Code:**
  ```bash
  cd backend/flask
  pip install -r requirements.txt
  python app.py
  ```
* Runs on: `http://localhost:5000` with auto-seeded database (`voting_system.db`).

---

### 2. Python FastAPI Backend (`backend/fastapi/`)
* **Framework:** FastAPI + Pydantic + Uvicorn
* **File:** `backend/fastapi/main.py`
* **How to run in VS Code:**
  ```bash
  cd backend/fastapi
  pip install -r requirements.txt
  uvicorn main:app --reload --port 8000
  ```
* Runs on: `http://localhost:8000`
* **Interactive Swagger UI Documentation:** Open `http://localhost:8000/docs` in your browser.

---

### 3. Node.js Express Backend (`backend/node/`)
* **Framework:** Node.js + Express
* **File:** `backend/node/server.js`
* **How to run in VS Code:**
  ```bash
  npm run backend
  ```
  *(or `node backend/node/server.js`)*
* Runs on: `http://localhost:5000`

---

### 4. Postman Collection (`postman/`)
* **File:** `postman/Online_Voting_System.postman_collection.json`
* **How to Import into Postman:**
  1. Open the **Postman** desktop application or web app.
  2. Click the **Import** button in the top left.
  3. Drag and drop `postman/Online_Voting_System.postman_collection.json` (or click *Select Files*).
  4. The collection **"ONLINE VOTING SYSTEM – Aadhaar OTP Backend API"** will appear with all 8 requests:
     * `0. System Health / Health Check`
     * `1. Voter Authentication / Request Aadhaar-Style OTP`
     * `1. Voter Authentication / Verify OTP Code`
     * `2. Ballot & Candidates / Get All Contesting Candidates`
     * `2. Ballot & Candidates / Cast Electronic Ballot`
     * `3. Election Results / Get Real-Time Election Results`
     * `3. Election Results / Get Registered Voters List`
     * `4. Admin Operations / Admin Login`
     * `4. Admin Operations / Reset Election Tallies`
     * `4. Admin Operations / Get Security Audit Logs`

---

### 5. Connecting React Frontend to Backend
1. Open `src/services/api.js`.
2. Set:
   ```javascript
   export const USE_REAL_BACKEND = true;
   export const BACKEND_URL = 'http://localhost:5000'; // Or 'http://localhost:8000' for FastAPI
   ```
3. Save the file. The React frontend will now send real HTTP requests to your backend server!
