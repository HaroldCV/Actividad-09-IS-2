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
    const yelpApiKey = 'uBqK1T1TTqXIXU4Vs-kLxB-A7vjnljkCtXlEot8yFwW1wxVKILptmRBaEh4saV1l1ok4gFQN9p7S2AzrMzb-uqPEmOa9Eq2gtbAQE-qmau-ALWXXOaixe6AJXYJuZHYx';

    const adjustedLatitude = parseFloat(latitude) + getRandomOffset();
    const adjustedLongitude = parseFloat(longitude) + getRandomOffset();

    const options = {
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${yelpApiKey}`,
      },
    };

    const yelpResponse = await axios.get(
      `https://api.yelp.com/v3/businesses/search?latitude=${adjustedLatitude}&longitude=${adjustedLongitude}&categories=restaurants&limit=3&sort_by=best_match`,
      options
    );

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
