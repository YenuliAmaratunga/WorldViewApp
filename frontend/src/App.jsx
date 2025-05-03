import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Select from "react-select";
import {
  getAllCountries,
  searchCountriesByName,
  filterCountriesByRegion,
} from "./services/countryService";

function App() {
  //State variable to hold the fetched array of country data
  const [countries, setCountries] = useState([]);
  const [regions, setRegions] = useState([]); // will hold the list of unique regions
  const [languages, setLanguages] = useState([]); // list of unique languages
  const [selectedLanguages, setSelectedLanguages] = useState([]); // selected languages

  //runs only once when the app loads
  useEffect(() => {
    //calls getAllCountries and saves the received data to countries using setCountries
    getAllCountries().then((data) => {
      setCountries(data);

      // Extract unique regions
      const uniqueRegions = [
        ...new Set(data.map((country) => country.region).filter(Boolean)),
      ].sort();
      setRegions(uniqueRegions);

      // Dynamic language extraction
      const languageSet = new Set();
      data.forEach((country) => {
        if (country.languages) {
          Object.values(country.languages).forEach((lang) =>
            languageSet.add(lang)
          );
        }
      });
      setLanguages([...languageSet].sort());
    });
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
        {regions.map((region, index) => (
          <option key={index} value={region}>
            {region}
          </option>
        ))}
      </select>

      {/* Language Filter Dropdown */}
      <div className="mt-4 w-full max-w-xs">
        <Select
          isMulti
          options={languages.map((lang) => ({ value: lang, label: lang }))}
          className="basic-multi-select"
          classNamePrefix="select"
          placeholder="Filter by language(s)..."
          onChange={(selectedOptions) => {
            const selected = selectedOptions.map((opt) => opt.value);
            setSelectedLanguages(selected);

            if (selected.length === 0) {
              getAllCountries().then(setCountries);
            } else {
              getAllCountries().then((data) => {
                const filtered = data.filter((country) => {
                  const countryLangs = country.languages
                    ? Object.values(country.languages)
                    : [];

                  //All selected languages must be included in the country's languages
                  return selected.every((lang) => countryLangs.includes(lang));
                });

                setCountries(filtered);
              });
            }
          }}
        />
      </div>
      {selectedLanguages.length > 0 && (
        <p className="mt-4 text-sm text-gray-600">
          Filtering by:{" "}
          <span className="font-semibold">{selectedLanguages.join(", ")}</span>
        </p>
      )}

      {/* List of countries*/}
      <ul className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {countries.map((country, index) => (
          <li
            key={index}
            className="bg-white p-4 shadow rounded-md border border-gray-100"
          >
            <Link
              to={`/country/${country.cca3}`}
              className="font-semibold text-lg text-blue-700 hover:underline"
            >
              {country.name.common}
            </Link>

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
