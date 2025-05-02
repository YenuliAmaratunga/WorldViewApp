const BASE_URL = "https://restcountries.com/v3.1";

export async function getAllCountries() {
  try {
    const response = await fetch(`${BASE_URL}/all`);
    if (!response.ok) throw new Error("Failed to fetch countries");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching countries:", error);
    return [];
  }
}
