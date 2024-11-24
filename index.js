const { resolve } = require('node:path');

const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

const app = express();
const port = 3000;

let db;

(async () => {
  db = await open({
    filename: './database.sqlite',
    driver: sqlite3.Database,
  });
})();

app.use(cors());
app.use(express.json());

app.get('/restaurants', async (req, res) => {
  try {
    const query = 'SELECT * FROM restaurants';
    const result = await db.all(query, []);

    if (result.length === 0) {
      return res.status(404).json({
        message: 'No restaurants found',
      });
    }

    return res.status(200).json({
      restaurants: result,
    });
  } catch (error) {
    console.error(`GET /restaurants - ERROR - ${error}`);
    return res.status(500).json({
      message: 'Some error occurred',
    });
  }
});

app.get('/restaurants/details/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const query = 'SELECT * FROM restaurants WHERE id = ?';
    const result = await db.all(query, [id]);

    if (result.length === 0) {
      return res.status(404).json({
        message: `No restaurants with id=${id} found`,
      });
    }

    return res.status(200).json({
      restaurant: result,
    });
  } catch (error) {
    console.error(`GET /restaurants - ERROR - ${error}`);
    return res.status(500).json({
      message: 'Some error occurred',
    });
  }
});

app.get('/restaurants/cuisine/:cuisine', async (req, res) => {
  const { cuisine } = req.params;

  try {
    const query = 'SELECT * FROM restaurants WHERE cuisine = ?';
    const result = await db.all(query, [cuisine]);

    if (result.length === 0) {
      return res.status(404).json({
        message: `No restaurants with cuisine=${cuisine} found`,
      });
    }

    return res.status(200).json({
      restaurants: result,
    });
  } catch (error) {
    console.error(`GET /restaurants - ERROR - ${error}`);
    return res.status(500).json({
      message: 'Some error occurred',
    });
  }
});

app.get('/restaurants/filter', async (req, res) => {
  const { isVeg, hasOutdoorSeating, isLuxury } = req.query;

  try {
    const query = `SELECT * FROM restaurants
                    WHERE isVeg = ? 
                    AND hasOutdoorSeating = ? 
                    AND isLuxury = ?`;
    const result = await db.all(query, [isVeg, hasOutdoorSeating, isLuxury]);

    if (result.length === 0) {
      return res.status(404).json({
        message: `No restaurants with the chosen filters found`,
      });
    }

    return res.status(200).json({
      restaurants: result,
    });
  } catch (error) {
    console.error(`GET /restaurants - ERROR - ${error}`);
    return res.status(500).json({
      message: 'Some error occurred',
    });
  }
});

app.get('/restaurants/sort-by-rating', async (req, res) => {
  try {
    const query = `SELECT * FROM restaurants
                    ORDER BY RATING DESC`;
    const result = await db.all(query, []);

    if (result.length === 0) {
      return res.status(404).json({
        message: `No restaurants found`,
      });
    }

    return res.status(200).json({
      restaurants: result,
    });
  } catch (error) {
    console.error(`GET /restaurants - ERROR - ${error}`);
    return res.status(500).json({
      message: 'Some error occurred',
    });
  }
});

app.get('/dishes', async (req, res) => {
  try {
    const query = `SELECT * FROM dishes`;
    const result = await db.all(query, []);

    if (result.length === 0) {
      return res.status(404).json({
        message: `No dishes found`,
      });
    }

    return res.status(200).json({
      dishes: result,
    });
  } catch (error) {
    console.error(`GET /dishes - ERROR - ${error}`);
    return res.status(500).json({
      message: 'Some error occurred',
    });
  }
});

app.get('/dishes/details/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const query = 'SELECT * FROM dishes WHERE id = ?';
    const result = await db.all(query, [id]);

    if (result.length === 0) {
      return res.status(404).json({
        message: `No dish with id=${id} found`,
      });
    }

    return res.status(200).json({
      dish: result,
    });
  } catch (error) {
    console.error(`GET /dishes - ERROR - ${error}`);
    return res.status(500).json({
      message: 'Some error occurred',
    });
  }
});

app.get('/dishes/filter', async (req, res) => {
  const { isVeg } = req.query;

  try {
    const query = `SELECT * FROM dishes WHERE isVeg = ?`;
    const result = await db.all(query, [isVeg]);

    if (result.length === 0) {
      return res.status(404).json({
        message: `No dishes with chosen filters found`,
      });
    }

    return res.status(200).json({
      dishes: result,
    });
  } catch (error) {
    console.error(`GET /dishes - ERROR - ${error}`);
    return res.status(500).json({
      message: 'Some error occurred',
    });
  }
});

app.get('/dishes/sort-by-price', async (req, res) => {
  const { isVeg } = req.query;

  try {
    const query = `SELECT * FROM dishes
                    ORDER BY price`;
    const result = await db.all(query, []);

    if (result.length === 0) {
      return res.status(404).json({
        message: `No dishes found`,
      });
    }

    return res.status(200).json({
      dishes: result,
    });
  } catch (error) {
    console.error(`GET /dishes - ERROR - ${error}`);
    return res.status(500).json({
      message: 'Some error occurred',
    });
  }
});

app.listen(port, () => {
  console.log(`FoodieFinds API listening at http://localhost:${port}`);
});
