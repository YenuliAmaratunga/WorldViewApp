import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Select from "react-select";
import {
  getAllCountries,
  searchCountriesByName,
  filterCountriesByRegion,
} from "./services/countryService";
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  //State variable to hold the fetched array of country data
  const [countries, setCountries] = useState([]);
  const [regions, setRegions] = useState([]); // will hold the list of unique regions
  const [languages, setLanguages] = useState([]); // list of unique languages
  const [selectedLanguages, setSelectedLanguages] = useState([]); // selected languages
const [user, setUser] = useState(null);
const [favorites, setFavorites] = useState([]);
const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);

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

      const storedToken = localStorage.getItem("token");
const storedUser = JSON.parse(localStorage.getItem("user"));

if (storedToken && storedUser) {
  setUser({ ...storedUser, token: storedToken });

  fetch("http://localhost:5000/api/users/favorites", {
    headers: {
      Authorization: `Bearer ${storedToken}`,
    },
  })
    .then((res) => res.json())
    .then((data) => setFavorites(data.favorites || []));
}

    });
  }, []);

  const toggleFavorite = async (code) => {
    if (!user || !user.token) {
      alert("Please log in first to favorite countries");
      return;
    }
  
    try {
      const res = await fetch("http://localhost:5000/api/users/favorites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ countryCode: code }),
      });
  
      const data = await res.json();
      setFavorites(data.favorites);
    } catch (err) {
      console.error("Failed to toggle favorite:", err);
    }
  };
  

  return (
    <>
      <Header />
      <main className="pb-12"> {/* Padding so footer doesn’t overlap */}
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

<div className="mt-4">
  <label className="inline-flex items-center">
    <input
      type="checkbox"
      checked={showOnlyFavorites}
      onChange={(e) => setShowOnlyFavorites(e.target.checked)}
      className="form-checkbox h-4 w-4 text-green-600"
    />
    <span className="ml-2 text-sm text-gray-700">Show only favorites</span>
  </label>
</div>


      {/* List of countries*/}
      <ul className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {countries
  .filter((country) =>
    showOnlyFavorites ? favorites.includes(country.cca3) : true
  )
  .map((country, index) => (
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

      <button
        onClick={() => toggleFavorite(country.cca3)}
        className="text-xl mt-2"
      >
        {favorites.includes(country.cca3) ? "❤️" : "🤍"}
      </button>

      <br />
      <span className="text-sm text-gray-600">
        🌍 Region: {country.region}
      </span>
    </li>
))}

      </ul>
    </div>
    </main>
      <Footer />
    </>
  );
}

export default App;
