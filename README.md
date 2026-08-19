# EduShield AI — Academic Dropout Prediction & Intervention System

> **Tagline:** *"Predict Early. Support Personally. Empower Every Student."*  
> **SDG Alignment:** **SDG 4 – Quality Education** | **Theme:** AI for Education & Human Development | **Domain:** EdTech & Learning Analytics

---

## 🔒 Enterprise Security Hardening

EduShield AI includes top-tier security features protecting data integrity and preventing unauthorized access:

1. **HTTP Security Headers (Helmet.js)**
   - Strict Transport Security (HSTS) with 1-year max age.
   - X-Frame-Options (`SAMEORIGIN`), X-Content-Type-Options (`nosniff`), XSS Filters.
2. **Rate Limiting Protection (`express-rate-limit`)**
   - **Auth Limiter**: Maximum 10 authentication requests per 15 minutes per IP (prevents brute-force attacks).
   - **AI Prediction Limiter**: Maximum 30 prediction requests per 15 minutes per IP (prevents ML endpoint flooding).
   - **Global API Limiter**: Maximum 150 requests per 15 minutes per IP.
3. **NoSQL Injection Sanitization (`express-mongo-sanitize`)**
   - Strips malicious query operators (`$`, `.`) from request bodies and URL parameters.
4. **JWT Authentication & Role-Based Access Control (RBAC)**
   - Hashed passwords using `bcryptjs` (salt rounds: 10).
   - Enforced role scopes: `Admin`, `Faculty`, `Student`.
5. **Cross-Origin Protection (CORS)**
   - Configured cross-origin resource sharing supporting local network IPs and secure public proxy tunnels.

---

## 🌐 How to Share & Give Access to Friends

### Option 1: Share on the Same Wi-Fi / Local Network (LAN)
Anyone connected to your Wi-Fi network (friends, mobile devices, laptops) can open:
```text
http://10.96.196.67:3000/
```
*(Your exact local IP is `10.96.196.67`)*

### Option 2: Share Over the Public Internet (Worldwide Access)
To let friends anywhere in the world access your website:
1. Open PowerShell in your project folder.
2. Run the command:
   ```bash
   npm run share
   ```
3. It will generate a public URL (e.g. `https://xxx.loca.lt`). Send that link to your friends!

---

## 🚀 Key Features

1. **Student Success Command Center (Executive Dashboard)**
   - Real-time aggregate statistics: Total Monitored (1,250+), High Risk, Medium Risk, Low Risk, Active Interventions.
   - Interactive Recharts Visualizations: Donut distribution, 5-month risk trends line chart, department risk breakdown, attendance vs GPA scatter matrix.
   - Dynamic AI Insights engine summarizing key systemic risks across departments.

2. **360° Student Directory & Profile Analytics**
   - Detailed academic overview: Attendance %, GPA trajectory, LMS login frequency, quiz scores, assignment submission rate, backlog counts.
   - **Explainable AI (XAI) Breakdown**: Answers *"Why is this student at risk?"* by ranking features (e.g. Attendance Drop = High Impact, GPA Decline = High Impact).
   - Circular progress score meter (0–100%) with calibrated confidence levels.

3. **Personalized Intervention Workflow Engine**
   - Automatically suggests tailored interventions based on specific risk factors.
   - Interactive timeline UI tracking status progression: `AI Risk Alert -> Intervention Assigned -> Mentor Action -> Outcome Evaluation`.

4. **Interactive Prediction Studio**
   - Sandbox allowing faculty to adjust student parameters via sliders and run instant on-demand ML predictions.

5. **Bulk CSV Import & Dataset Validation**
   - Parses CSV data, performs boundary checks (GPA 0-10, Attendance 0-100), logs schema errors, and triggers batch ML predictions.

---

## 🔑 Demo Credentials

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@edushield.ai` | `password123` |
| **Faculty / Mentor** | `faculty@edushield.ai` | `password123` |
| **Student** | `student@edushield.ai` | `password123` |

---

## 🚦 Running the Application

To start all services locally:
```bash
npm start
```
