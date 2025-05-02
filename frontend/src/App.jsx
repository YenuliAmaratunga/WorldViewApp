import { useEffect, useState } from 'react';
import { getAllCountries } from './services/countryService';

function App() {
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    getAllCountries().then(data => setCountries(data));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Countries List</h1>
      <ul className="list-disc pl-6">
        {countries.map((country, index) => (
          <li key={index}>{country.name.common}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
