import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { API_BASE_URL } from "../config";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

import "leaflet/dist/leaflet.css";

// Fix Leaflet's missing marker icons in deployed builds
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

function CountryDetail() {
  const { code } = useParams();
  const [country, setCountry] = useState(null);
  const [borders, setBorders] = useState([]);
  const [user, setUser] = useState(null);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    fetch(`https://restcountries.com/v3.1/alpha/${code}`)
      .then((res) => res.json())
      .then(async (data) => {
        const countryData = data[0];
        setCountry(countryData);

        // Fetch bordering country names using CCA3 codes
        if (countryData.borders?.length > 0) {
          const borderRes = await fetch(
            `https://restcountries.com/v3.1/alpha?codes=${countryData.borders.join(
              ","
            )}`
          );
          const borderData = await borderRes.json();
          const formattedBorders = borderData.map((c) => ({
            name: c.name.common,
            cca3: c.cca3,
          }));
          setBorders(formattedBorders);
        } else {
          setBorders([]);
        }
      })
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
            className="text-oceanGreen hover:underline text-lg font-medium inline-block mb-6"
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
                title={
                  isFavorited ? "Remove from Favorites" : "Add to Favorites"
                }
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

            {country.latlng && (
              <div className="my-6">
                <h2 className="text-xl font-bold text-deepTeal mb-2">
                  Location on Map:
                </h2>
                <MapContainer
                  center={country.latlng}
                  zoom={5}
                  scrollWheelZoom={false}
                  className="h-64 w-full rounded-xl shadow-md border border-aquaMint"
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker position={country.latlng}>
                    <Popup>{country.name.common}</Popup>
                  </Marker>
                </MapContainer>
              </div>
            )}

            {/* Info Grid */}
            <div className="grid gap-6 md:grid-cols-2 text-deepTeal">
              <div className="space-y-2">
                <p>
                  <strong>Capital:</strong> {country.capital?.[0] || "N/A"}
                </p>
                <p>
                  <strong>Region:</strong> {country.region}
                </p>
                <p>
                  <strong>Population:</strong>{" "}
                  {country.population.toLocaleString()}
                </p>
              </div>

              <div className="space-y-2">
                <p>
                  <strong>Languages:</strong>
                </p>
                <ul className="list-disc list-inside text-sm">
                  {country.languages ? (
                    Object.values(country.languages).map((lang, index) => (
                      <li key={index}>{lang}</li>
                    ))
                  ) : (
                    <li>N/A</li>
                  )}
                </ul>
              </div>
            </div>

            {/* Bordering Countries */}
            {borders.length > 0 && (
              <div className="mt-10">
                <h2 className="text-xl font-bold text-deepTeal mb-2">
                  Bordering Countries:
                </h2>
                <ul className="flex flex-wrap gap-3 text-sm">
                  {borders.map((border, i) => (
                    <li key={i}>
                      <Link
                        to={`/country/${border.cca3}`}
                        className="bg-aquaMint hover:bg-skyBlue text-deepTeal font-medium px-3 py-1 rounded-full shadow-sm transition"
                      >
                        {border.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default CountryDetail;
