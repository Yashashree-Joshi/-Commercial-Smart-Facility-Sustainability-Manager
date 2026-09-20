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

Sustainability includes reduction actions based on active water anomalies.

## Facility context

Terminal, floor and zone dropdowns are click-controlled and persist through the backend `/api/context` endpoint. Terminal 2 zone information from the supplied facility context is preserved in the data layer and displayed in the Facility Twin.
