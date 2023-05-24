import React from 'react';

const RestaurantList = ({ restaurants }) => {
  return (
    <div>
      <h2>Sugerencia de Restaurantes</h2>
      <ul>
        {restaurants.map((restaurant, index) => (
          <li key={index}>
            <h3>{restaurant.name}</h3>
            <p>Dirección: {restaurant.address}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RestaurantList;
