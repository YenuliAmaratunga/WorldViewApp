import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Select from "react-select";
import {
  getAllCountries,
  searchCountriesByName,
  filterCountriesByRegion,
} from "../services/countryService";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { API_BASE_URL } from "../config";

function Home() {
  //State variable to hold the fetched array of country data
  const [countries, setCountries] = useState([]);
  const [regions, setRegions] = useState([]); // will hold the list of unique regions
  const [languages, setLanguages] = useState([]); // list of unique languages
  const [selectedLanguages, setSelectedLanguages] = useState([]); // selected languages
  const [user, setUser] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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

        fetch(`${API_BASE_URL}/api/users/favorites`, {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        })
          .then((res) => res.json())
          .then((data) => setFavorites(data.favorites || []));
      }
    });
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };
  
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleFavorite = async (code) => {
    if (!user || !user.token) {
      alert("Please log in first to favorite countries");
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/users/favorites`, {
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
      <main className="min-h-screen w-full bg-gradient-to-br from-aquaMint via-oceanGreen to-aquaMint p-6">
        <div className="flex-grow p-6 ">
          {/* Filters Row */}
<div
  className={`sticky top-[80px] z-40 p-4 flex flex-wrap gap-4 items-center justify-center transition duration-300 ${
    scrolled
      ? "bg-aquaMint/90 border border-aquaMint rounded-xl shadow-md"
      : "bg-transparent"
  }`}
>
          <input
              type="text"
              placeholder="Search by name"
              onChange={(e) => {
                const query = e.target.value;
                if (query === "") {
                  getAllCountries().then(setCountries);
                } else {
                  searchCountriesByName(query).then(setCountries);
                }
              }}
              className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring focus:border-blue-400 w-60"
            />

            <select
              onChange={(e) => {
                const region = e.target.value;
                if (region === "") {
                  getAllCountries().then(setCountries);
                } else {
                  filterCountriesByRegion(region).then(setCountries);
                }
              }}
              className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring focus:border-blue-400 w-60"
            >
              <option value="">All Regions</option>
              {regions.map((region, index) => (
                <option key={index} value={region}>
                  {region}
                </option>
              ))}
            </select>

            <div className="w-60">
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
                        const countryLangs = country.languages ? Object.values(country.languages) : [];
                        return selected.every((lang) => countryLangs.includes(lang));
                      });
                      setCountries(filtered);
                    });
                  }
                }}
              />
            </div>

            <label className="inline-flex items-center text-white">
              <input
                type="checkbox"
                checked={showOnlyFavorites}
                onChange={(e) => setShowOnlyFavorites(e.target.checked)}
                className="form-checkbox h-4 w-4 text-green-600"
              />
              <span className="ml-2 text-sm">Show only favorites</span>
            </label>
          </div>

          {/* Country Cards */}
          <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-6">
            {countries
              .filter((country) => (showOnlyFavorites ? favorites.includes(country.cca3) : true))
              .map((country, index) => (
                <li
                  key={index}
                  className="bg-white rounded-xl border-4 border-aquaMint p-4 hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] cursor-pointer"
                >
                  <Link to={`/country/${country.cca3}`} className="block space-y-2">
                    <img
                      src={country.flags.png}
                      alt={`Flag of ${country.name.common}`}
                      className="w-full h-32 object-contain object-center rounded-md bg-white"
                    />
                    <div className="flex justify-between items-start">
                      <div className="text-deepTeal font-bold text-lg">
                        {country.name.common}
                      </div>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          toggleFavorite(country.cca3);
                        }}
                        className={`text-xl ${favorites.includes(country.cca3) ? "text-red-500" : "text-gray-400"} hover:scale-110 transition`}
                        title={favorites.includes(country.cca3) ? "Remove from Favorites" : "Add to Favorites"}
                      >
                        {favorites.includes(country.cca3) ? "❤️" : "🤍"}
                      </button>
                    </div>
                    <p className="text-sm text-gray-600">
                      🌍 Region: <span className="text-deepTeal font-medium">{country.region}</span>
                    </p>
                  </Link>
                </li>
              ))}
          </ul>
        </div>   </main>

        <Footer />  
      
    </>
  );
}

export default Home;
