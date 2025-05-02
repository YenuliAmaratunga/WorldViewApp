import { useEffect, useState } from "react";
import {
  getAllCountries,
  searchCountriesByName,
  filterCountriesByRegion,
} from "./services/countryService";

function App() {
  //State variable to hold the fetched array of country data
  const [countries, setCountries] = useState([]);

  //runs only once when the app loads
  useEffect(() => {
    //calls getAllCountries and saves the received data to countries using setCountries
    getAllCountries().then((data) => setCountries(data));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-darkGreen mb-6 font-sans">
        🌍 WorldViewApp – Country Explorer
      </h1>

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search by name"
        onChange={(e) => {
          const query = e.target.value;
          if (query === "") {
            getAllCountries().then(setCountries); //if empty reload all countries
          } else {
            searchCountriesByName(query).then(setCountries); //else, search by name
          }
        }}
        className="border border-gray-300 p-2 rounded-md mr-4 focus:outline-none focus:ring focus:border-blue-400"
      />

      {/* Region Filter Dropdown */}
      <select
        onChange={(e) => {
          const region = e.target.value;
          if (region === "") {
            getAllCountries().then(setCountries);
          } else {
            filterCountriesByRegion(region).then(setCountries);
          }
        }}
        className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring focus:border-blue-400"
      >
        <option value="">All Regions</option>
        <option value="Africa">Africa</option>
        <option value="Americas">Americas</option>
        <option value="Asia">Asia</option>
        <option value="Europe">Europe</option>
        <option value="Oceania">Oceania</option>
      </select>

      {/* List of countries*/}
      <ul className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {countries.map((country, index) => (
          <li
            key={index}
            className="bg-white p-4 shadow rounded-md border border-gray-100"
          >
            <span className="font-semibold text-lg">{country.name.common}</span>
            <br />
            <span className="text-sm text-gray-600">
              🌍 Region: {country.region}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
