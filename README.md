# KOHLER Facility Intelligence — v1.1 Modular

A reusable React + Vite facility-intelligence prototype with a Node telemetry/ticket simulation backend.

## Run on Windows

```powershell
pnpm install
pnpm dev
```

Open `http://127.0.0.1:5173/`.

If you prefer two terminals:

```powershell
pnpm dev:backend
pnpm dev:frontend
```

Backend health: `http://127.0.0.1:8787/api/health`

Demo login:
- Username: `admin`
- Password: `Kohler@123`

## Architecture

```text
src/
├── App.jsx
├── main.jsx
├── data/facility.js
├── services/api.js
├── hooks/useFacilityStream.js
├── components/Common.jsx
├── pages/
│   ├── Overview.jsx
│   ├── LiveOperations.jsx
│   ├── FacilityTwin.jsx
│   ├── Analytics.jsx
│   ├── Maintenance.jsx
│   ├── Sustainability.jsx
│   ├── Simulation.jsx
│   └── OtherPages.jsx
└── styles.css

server/
└── index.mjs
```

## Simulation behavior

The Simulation page is the master control. Start/stop controls affect both restroom telemetry and simulated maintenance-ticket generation.

Scenarios:
- Normal operation
- High traffic → attention demand signal
- Leak injection → critical fixture, critical incident and automatic critical ticket
- Sensor fault → attention fixture, attention incident and simulated maintenance ticket

Manual ticket controls are available from Maintenance and the fixture workflow:
- Create
- Change status
- Resolve
- Remove

Stopping the simulation freezes telemetry and prevents new simulated ticket events.

## Analytics

Analytics is driven from the same live stream and includes:
- water consumption trend
- leak/excess-flow trend
- fixture utilization
- incident health
- water by fixture type
- projected leak water loss
- maintenance workload
- virtual water footprint

---

## 🎥 Video Demonstration

### KOHLER Facility Intelligence — Working Prototype

▶️ **[Watch the 1–3 minute demonstration video](https://drive.google.com/file/d/18V1tucO5W2u7Eg_-ER_6_S-ljulQYhij/view?usp=sharing)**

The demonstration covers:

- Login and dashboard
- Facility Twin
- Terminal, floor and zone navigation
- Real-time simulation
- Water-leak detection
- Restroom telemetry
- Automatic maintenance ticket generation
- Manual ticket management
- Ticket resolution
- Analytics and water-loss analysis
- Virtual water footprint
- Sustainability recommendations

Sustainability includes reduction actions based on active water anomalies.

## Facility context

Terminal, floor and zone dropdowns are click-controlled and persist through the backend `/api/context` endpoint. Terminal 2 zone information from the supplied facility context is preserved in the data layer and displayed in the Facility Twin.


---

## 🤖 Prompt Documentation

The Prompt Documentation contains the complete AI-assisted development record used to build the KOHLER Facility Intelligence prototype.

It documents the iterative development process, including:

- Initial requirement analysis and solution ideation
- System architecture and technology decisions
- UI/UX generation and refinement
- Facility Twin and terminal/floor/zone design
- Restroom and fixture intelligence
- Simulation and telemetry design
- Water-leak detection and anomaly logic
- Maintenance-ticket automation
- Manual ticket creation, status changes and resolution
- Analytics and water-loss analysis
- Virtual water-footprint design
- Sustainability recommendations
- Backend integration
- Frontend/backend debugging
- Error correction and refactoring
- Modularization and reusable component design
- Final integration and refinement

The documentation preserves the evolution of the solution across multiple prompt iterations rather than documenting only the final implementation.

---

## 🎨 Presentation Deck

The presentation deck summarizes the complete solution within the required maximum of four slides.

It covers:

- **Problem & Opportunity** — Water wastage, high-footfall facilities and maintenance challenges
- **Proposed Solution** — Real-time monitoring, Facility Twin, anomaly detection and predictive dispatch
- **System Architecture** — React, Node.js, simulation, analytics and facility intelligence
- **Innovation & Impact** — Leak-to-ticket automation, water-loss analysis, virtual water footprint and sustainability impact

---

## 🚀 Implemented Project

KOHLER Facility Intelligence is a functional full-stack prototype connecting facility monitoring, simulation, anomaly detection, maintenance and sustainability.

### Core Features

- React + Vite frontend
- Node.js backend
- Facility Digital Twin
- Terminal → Floor → Zone → Restroom → Fixture navigation
- Clickable facility and zone selections
- Real-time-style simulated telemetry
- Start / Stop simulation controls
- Normal, High Traffic, Leak and Sensor Fault scenarios
- Water-flow and continuous-leak monitoring
- Fixture-level status: Normal, Attention, Critical and Sensor Fault
- Automatic incident generation
- Automatic maintenance-ticket generation
- Manual ticket creation and removal
- Ticket status updates and resolution
- Live Operations dashboard
- Water consumption analytics
- Leak / excess-flow analytics
- Fixture utilization analytics
- Maintenance workload analytics
- Projected water-loss analysis
- Virtual water footprint
- Sustainability recommendations
- Shared frontend/backend facility state
- Modular and reusable React architecture

### End-to-End Workflow

```text
Telemetry
   ↓
Anomaly Detection
   ↓
Incident
   ↓
Maintenance Ticket
   ↓
Resolution
   ↓
Water-Loss Analysis
   ↓
Sustainability Insight
