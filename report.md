# SE3040 - AF- Assignment 02 Report

## Student Information

- **Name**: Amaratunga Y.B.
- **Student ID**: IT22078650

## project Title

**WorldViewApp – Country Explorer**

## Brief Description

WorldViewApp is a full-stack web application that allows users to explore detailed information about countries worldwide. It provides features such as search, region/language filtering, map viewing, and user-specific favorites. The application is powered by the **REST Countries API** and includes user authentication with persistent favorites using a custom-built backend and MongoDB Atlas.

## 🚀 Key Functionalities

1. **View all countries** with name, region, population, flag, and capital.
2. **Search countries** by name (real-time).
3. **Filter countries** by:
   - Region (dropdown)
   - Languages (multi-select using `react-select`)
4. **User authentication**: Signup/Login using JWT.
5. **Favorites system**:
   - Mark/unmark countries as favorites.
   - Show only favorite countries.
   - Store favorites in backend (MongoDB).
6. **Detailed country page**:
   - Shows official name, population, region, capital, languages, and flag.
   - Displays **bordering countries** with links to navigate to each.
   - Embeds a map using `iframe` from OpenStreetMap.
7. **Responsive UI**: Designed using Tailwind CSS for mobile, tablet, and desktop views.
8. **Testing**:
   - Unit and integration testing implemented using **Vitest** and **React Testing Library**.

## Used APIs & Tools

- **REST Countries API**  
  [https://restcountries.com/](https://restcountries.com/)

- **Frontend**: React, Vite, Tailwind CSS, React Router  
- **Backend**: Node.js, Express, MongoDB Atlas  
- **Authentication**: JWT  
- **Testing**: Vitest, React Testing Library  
- **Deployment**:  
  - **Frontend** on Vercel  
  - **Backend** on Choreo 

---

## Deployment Links

- **Frontend** (Vercel):
  - https://world-view-app.vercel.app  
  - https://world-view-app-yenuli-amaratungas-projects.vercel.app  
  - https://world-view-app-git-main-yenuli-amaratungas-projects.vercel.app

- **Backend** (Choreo):
  - https://10b8c329-d78f-4b7f-8cd9-448ba1dae2e2-dev.e1-us-east-azure.choreoapis.dev/default/worldview-backend-service/v1.0

## Chosen API

### REST Countries API

- **Base URL**: `https://restcountries.com/`
- **Key Endpoints Used**:
  - `GET /v3.1/all`: Retrieve data for all countries (used for initial display and filtering).
  - `GET /v3.1/alpha/{code}`: Retrieve detailed data for a specific country by its 3-letter code (used in CountryDetail.jsx).
  - `GET /v3.1/name/{name}`: Search countries by name (used in Home.jsx search).
  - `GET /v3.1/region/{region}`: Filter countries by region (used in Home.jsx).

> These endpoints provided most of the country-related data including name, flags, languages, population, region, capital, and bordering countries.


## Challenges Faced & Resolutions

### 1. Deploying the Backend
- **Issue**: The biggest challenge was finding a suitable, always-on, free backend hosting provider that didn't require a credit card.
- **Resolution**: After testing multiple platforms, I successfully deployed the backend using **Choreo.dev**, which supported our Express server and MongoDB Atlas without issues.

### 2.  REST Countries API Delays
- **Issue**: At times, the public REST Countries API would return data slowly or inconsistently during high traffic, causing delays especially in search or detail page requests.
- **Resolution**: Added defensive coding to handle missing or undefined values

## Backend & Frontend Integration

- **Favorites API (Custom)**:
  - `GET /api/users/favorites`: Fetch user's current favorites from MongoDB.
  - `POST /api/users/favorites`: Add or remove a favorite country.

- **Authentication API (Custom)**:
  - `POST /api/auth/login`
  - `POST /api/auth/signup`

All backend endpoints are hosted on Choreo and protected using JWT tokens. Frontend sends requests using `Authorization: Bearer <token>` in headers.

## Testing Summary

Testing was done using **Vitest** and **React Testing Library**.

- **Unit Tests**:
  - LoginPage rendering
  - SignupPage rendering
  - Password toggle behavior

- **Integration Tests**:
  - Searching countries by name
  - Filtering countries based on input

Test data was mocked using `vi.mock()` to simulate API responses without relying on the live API during test runs.

## Testing Commands

To run all test cases:

```bash
npm run test
