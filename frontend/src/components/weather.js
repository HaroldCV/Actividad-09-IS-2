import React from 'react';

const Weather = ({ temperature }) => {
  return (
    <div>
      <h2>Pronóstico del clima para mañana</h2>
      <p>Temperatura máxima: {temperature}°C</p>
    </div>
  );
};

export default Weather;
