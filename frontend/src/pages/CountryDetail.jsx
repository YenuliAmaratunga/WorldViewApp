import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Header from '../components/Header';
import Footer from '../components/Footer';
import { API_BASE_URL } from "../config";

function CountryDetail() {
  const { code } = useParams();
  const [country, setCountry] = useState(null);
  const [user, setUser] = useState(null);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    fetch(`https://restcountries.com/v3.1/alpha/${code}`)
      .then((res) => res.json())
      .then((data) => setCountry(data[0]))
      .catch((err) => console.error("Error loading country", err));
  }, [code]);

  useEffect(() => {
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
  }, []);

  const toggleFavorite = async () => {
    if (!user || !user.token) {
      alert("Please log in to favorite this country.");
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

  if (!country) return <div className="p-6">Loading country data...</div>;

  const isFavorited = favorites.includes(code);

  return (
    <>
      <Header />
      <main className="min-h-screen w-full bg-gradient-to-br from-aquaMint via-oceanGreen to-aquaMint p-6">
        <div className="max-w-5xl mx-auto px-6">
          <Link
            to="/"
            className="text-oceanGreen hover:underline text-l font-medium inline-block mb-6"
          >
            ⬅ Back to countries
          </Link>

          <div className="bg-offWhite rounded-2xl shadow-xl p-8 border-4 border-oceanGreen">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <div>
                <h1 className="text-4xl font-bold text-deepTeal">
                  {country.name.common}
                </h1>
                <p className="text-sm text-gray-600 italic">
                  {country.name.official}
                </p>
              </div>
              <button
                onClick={toggleFavorite}
                className={`text-3xl transition transform hover:scale-110 ${
                  isFavorited ? "text-red-500" : "text-gray-400"
                }`}
                title={isFavorited ? "Remove from Favorites" : "Add to Favorites"}
              >
                {isFavorited ? "❤️" : "🤍"}
              </button>
            </div>

            {/* Flag Centered */}
            <div className="flex justify-center mb-8">
              <img
                src={country.flags.png}
                alt={`Flag of ${country.name.common}`}
                title={`Flag of ${country.name.common}`}
                className="w-72 h-auto rounded-xl shadow-md border border-aquaMint"
              />
            </div>

            {/* Info Grid */}
            <div className="grid gap-6 md:grid-cols-2 text-deepTeal">
              <div className="space-y-2">
                <p><strong>Capital:</strong> {country.capital?.[0] || "N/A"}</p>
                <p><strong>Region:</strong> {country.region}</p>
                <p><strong>Population:</strong> {country.population.toLocaleString()}</p>
              </div>

              <div className="space-y-2">
                <p><strong>Languages:</strong></p>
                <ul className="list-disc list-inside text-sm">
                  {country.languages
                    ? Object.values(country.languages).map((lang, index) => (
                        <li key={index}>{lang}</li>
                      ))
                    : <li>N/A</li>}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default CountryDetail;
