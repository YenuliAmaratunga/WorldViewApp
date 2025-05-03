import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

function CountryDetail() {
  const { code } = useParams();
  const [country, setCountry] = useState(null);
  const [user, setUser] = useState(null);
  const [favorites, setFavorites] = useState([]);

  // Fetch the selected country from the API
  useEffect(() => {
    fetch(`https://restcountries.com/v3.1/alpha/${code}`)
      .then((res) => res.json())
      .then((data) => setCountry(data[0]))
      .catch((err) => console.error("Error loading country", err));
  }, [code]);

  // Load user and their favorites from localStorage
  useEffect(() => {
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
  }, []);

  const toggleFavorite = async () => {
    if (!user || !user.token) {
      alert("Please log in to favorite this country.");
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

  if (!country) return <div className="p-6">Loading country data...</div>;

  const isFavorited = favorites.includes(code);

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans">
      <Link to="/" className="text-blue-600 hover:underline mb-4 inline-block">
        ⬅ Back to countries
      </Link>

      <div className="flex items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold">{country.name.common}</h1>
        <button onClick={toggleFavorite} className="text-2xl">
          {isFavorited ? "❤️" : "🤍"}
        </button>
      </div>

      <img
        src={country.flags.png}
        alt={`Flag of ${country.name.common}`}
        title={`This is the official flag of ${country.name.common}`}
        className="w-60 mb-6 shadow-md rounded"
      />

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <p><strong>Official Name:</strong> {country.name.official}</p>
          <p><strong>Capital:</strong> {country.capital?.[0] || "N/A"}</p>
          <p><strong>Region:</strong> {country.region}</p>
          <p><strong>Population:</strong> {country.population.toLocaleString()}</p>
        </div>

        <div>
          <p><strong>Languages:</strong></p>
          <ul className="list-disc pl-6">
            {country.languages
              ? Object.values(country.languages).map((lang, index) => (
                  <li key={index}>{lang}</li>
                ))
              : <li>N/A</li>}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default CountryDetail;
