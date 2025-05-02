const BASE_URL = "https://restcountries.com/v3.1";

export async function getAllCountries() {
  try {
    const response = await fetch(`${BASE_URL}/all`);
    if (!response.ok) throw new Error("Failed to fetch countries");
    const data = await response.json(); //convert response to JSON
    return data; //return an array of country objects
  } catch (error) {
    console.error("Error fetching countries:", error);
    return [];
  }
}

export async function searchCountriesByName(name) {
  try {
    const response = await fetch(`https://restcountries.com/v3.1/name/${name}`);
    if (!response.ok) throw new Error("Search failed");
    return await response.json();
  } catch (error) {
    console.error("Search error:", error);
    return [];
  }
}

export async function filterCountriesByRegion(region) {
  try {
    const response = await fetch(
      `https://restcountries.com/v3.1/region/${region}`
    );
    if (!response.ok) throw new Error("Region filter failed");
    return await response.json();
  } catch (error) {
    console.error("Region filter error:", error);
    return [];
  }
}