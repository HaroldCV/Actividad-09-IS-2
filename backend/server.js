const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const port = 3001;

app.use(express.json());
app.use(cors());

const coordinateOffset = 0.01;

app.get('/api/yelp', async (req, res) => {
  try {
    const { latitude, longitude } = req.query;
    const yelpApiKey = '2NOSzJJj4SLL1wvE7mdIXYCs2S50MmCiZgpiUyTMMe1umXrzb6XixgieCKb2ku7j0kezXREOBut-v74qw0Ai_SbLPjfpDbNEQ4KPdw__rvE3GrtET4WnmJ0kWpRuZHYx';

    const adjustedLatitude = parseFloat(latitude) + getRandomOffset();
    const adjustedLongitude = parseFloat(longitude) + getRandomOffset();

    const options = {
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${yelpApiKey}`,
      },
    };
    console.log('Recibida solicitud a /api/yelp');
    const yelpResponse = await axios.get(
      `https://api.yelp.com/v3/businesses/search?latitude=${adjustedLatitude}&longitude=${adjustedLongitude}&categories=restaurants&limit=3&sort_by=best_match`,
      options
    );
    console.log('Respuesta de Yelp recibida');
    const restaurants = yelpResponse.data.businesses.map((business) => {
      const { name, location } = business;
      const address = location.display_address.join(', ');
      return { name, address };
    });

    res.json(restaurants);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener los datos de Yelp' });
  }
});

function getRandomOffset() {
  return Math.random() * coordinateOffset - coordinateOffset / 2;
}

app.listen(port, () => {
  console.log(`Servidor backend escuchando en el puerto ${port}`);
});
