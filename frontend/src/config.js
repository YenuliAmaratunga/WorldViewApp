// Use Choreo in production, fallback to localhost in dev
export const API_BASE_URL =
  import.meta.env.MODE === "production"
    ? "https://10b8c329-d78f-4b7f-8cd9-448ba1dae2e2-dev.e1-us-east-azure.choreoapis.dev/default/worldview-backend-service/v1.0"
    : "http://localhost:5000";