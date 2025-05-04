# WorldViewApp – Country Explorer

**Name**: Amaratunga Y.B.
**Student no**: IT22078650

WorldViewApp is a full-stack web application built using **React**, **Node.js**, and **MongoDB Atlas**, allowing users to explore countries, search and filter them, and manage personal favorites. The app integrates live data from the **REST Countries API**.


## Live Demo

- **Frontend (Vercel)**: https://world-view-app.vercel.app/   or   
https://world-view-app-yenuli-amaratungas-projects.vercel.app/     or      
https://world-view-app-git-main-yenuli-amaratungas-projects.vercel.app/

- **Backend (Choreo)**: https://10b8c329-d78f-4b7f-8cd9-448ba1dae2e2-dev.e1-us-east-azure.choreoapis.dev/default/worldview-backend-service/v1.0

---

## Features

- View all countries using the REST Countries API
- Search countries by name
- Filter by:
  - Region
  - Languages (multi-select)
- Mark/unmark countries as **favorites**
- Show only favorite countries
- View **detailed country page**:
  - Capital, region, population, flag
  - Languages
  - Bordering countries (click to navigate)
  - Embedded map
- Fully responsive design using **Tailwind CSS**
- **Login & Signup** system with token-based authentication
- Persistent favorites (stored in backend via MongoDB Atlas)
- **Unit and Integration Testing** with Vitest and React Testing Library

## 🛠️ Tech Stack

| Frontend       | React, React Router, Tailwind CSS             |
| Backend        | Node.js, Express                              |
| Database       | MongoDB Atlas                                 |
| Authentication | JWT (token-based)                             |
| Deployment     | Vercel (Frontend), Choreo.dev (Backend)       |
| API            | [REST Countries API](https://restcountries.com/) |
| Testing        | Vitest, React Testing Library                 |


## Run Tests

To execute all unit and integration tests:

```bash
npm run test

## Setup Instructions

1. Clone the Repository
    git clone https://github.com/<your-username>/worldview-app.git
    cd worldview-app

2. Install Frontend Dependencies
    cd frontend
    npm install

3. Install & Run Backend Locally
    cd ../backend
    npm install
    npm run dev

4. Start the Frontend Locally
    cd ../frontend
    npm run dev

The app should now be running at: http://localhost:5173