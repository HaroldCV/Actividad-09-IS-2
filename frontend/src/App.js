import React, { useState } from 'react';
import Weather from './components/weather';
import RestaurantList from './components/RestaurantList';

const App = () => {
  const [location, setLocation] = useState('');
  const [weather, setWeather] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const [isFetching, setIsFetching] = useState(false);

  const handleLocationChange = (event) => {
    setLocation(event.target.value);
  };

  const handleSubmit = () => {
    if (location) {
      fetchData();
    }
  };

  const fetchData = async () => {
    try {
      setIsFetching(true);

      const locationResponse = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${location}&format=json`
      );
      const locationData = await locationResponse.json();
      const latitude = locationData[0].lat;
      const longitude = locationData[0].lon;

      const weatherResponse = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&forecast_days=2&daily=temperature_2m_max&timezone=PST`
      );
      const weatherData = await weatherResponse.json();
      const tomorrowWeather = weatherData.daily.temperature_2m_max[1];

      const yelpApiKey = 'uBqK1T1TTqXIXU4Vs-kLxB-A7vjnljkCtXlEot8yFwW1wxVKILptmRBaEh4saV1l1ok4gFQN9p7S2AzrMzb-uqPEmOa9Eq2gtbAQE-qmau-ALWXXOaixe6AJXYJuZHYx'; // Reemplaza con tu propia clave de API de Yelp
      const yelpClientId = 'rFrNLlntauvYvyB8cEJodQ'; // Reemplaza con tu propio ID de cliente de Yelp

      const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${yelpApiKey}`,
          'X-Yelp-Client-ID': yelpClientId,
        },
      };

      const yelpResponse = await fetch(
        `http://localhost:3001/api/yelp?latitude=${latitude}&longitude=${longitude}`,
        options
      );
      const yelpData = await yelpResponse.json();
      const filteredRestaurants = yelpData.map((item) => {
        const { name, address } = item;
        return {
          name,
          address,
        };
      });

      setWeather(tomorrowWeather);
      setRestaurants(filteredRestaurants);
      setIsFetching(false);
    } catch (error) {
      console.error(error);
      setWeather(null);
      setRestaurants([]);
      setIsFetching(false);
    }
  };

  return (
    <div>
      <input type="text" value={location} onChange={handleLocationChange} />
      <button onClick={handleSubmit}>Enviar</button>

      {isFetching ? (
        <p>Cargando...</p>
      ) : (
        <>
          {weather && <Weather temperature={weather} />}
          {restaurants.length > 0 && <RestaurantList restaurants={restaurants} />}
        </>
      )}
    </div>
  );
};

export default App;
