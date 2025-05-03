import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

function CountryDetail() {
  // Extract the country code from the URL using useParams (e.g., "LKA" for Sri Lanka)
  const { code } = useParams();

  // This state will hold the data for a single country
  const [country, setCountry] = useState(null);

  // useEffect runs once when the component loads or when the code param changes
  useEffect(() => {
    fetch(`https://restcountries.com/v3.1/alpha/${code}`)
      .then((res) => res.json())
      .then((data) => setCountry(data[0])) // data comes as an array with one object
      .catch((err) => console.error("Error loading country", err));
  }, [code]);

  // If the data hasn't loaded yet, show a loading message
  if (!country) return <div className="p-6">Loading country data...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans">
      {/* Back Button */}
      <Link to="/" className="text-blue-600 hover:underline mb-4 inline-block">
        ⬅ Back to countries
      </Link>

      {/* Country Name */}
      <h1 className="text-3xl font-bold mb-6">{country.name.common}</h1>

      {/* Flag */}
      <img
        src={country.flags.png}
        alt={`Flag of ${country.name.common}`}
        title={`This is the official flag of ${country.name.common}`}
        className="w-60 mb-6 shadow-md rounded"
      />

      {/* Grid layout for details */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* LEFT SIDE: Main country info */}
        <div>
          <p>
            <strong>Official Name:</strong> {country.name.official}
          </p>
          <p>
            <strong>Capital:</strong> {country.capital?.[0] || "N/A"}
          </p>
          <p>
            <strong>Region:</strong> {country.region}
          </p>
          <p>
            <strong>Population:</strong> {country.population.toLocaleString()}
          </p>
        </div>

        {/* RIGHT SIDE: Languages */}
        <div>
          <p>
            <strong>Languages:</strong>
          </p>
          <ul className="list-disc pl-6">
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
    </div>
  );
}

export default CountryDetail;
