const express = require('express');
const { convertCurrency, getCachedRates } = require('../currencyService');

const router = express.Router();

// GET /convert?from=USD&to=BRL&amount=100
router.get('/convert', async (req, res) => {
  try {
    const { from, to, amount } = req.query;
    
    if (!from || !to || !amount) {
      return res.status(400).json({ 
        error: 'Parâmetros from, to e amount são obrigatórios' 
      });
    }

    const result = await convertCurrency(from, to, parseFloat(amount));
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /rates
router.get('/rates', async (req, res) => {
  try {
    const rates = await getCachedRates();
    res.json(rates);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;