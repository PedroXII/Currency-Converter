const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');

const CACHE_FILE = path.join(__dirname, 'cache.json');
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutos

// Carregar cache do arquivo JSON
async function loadCache() {
  try {
    const data = await fs.readFile(CACHE_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return {};
  }
}

// Salvar cache no arquivo JSON
async function saveCache(cache) {
  await fs.writeFile(CACHE_FILE, JSON.stringify(cache, null, 2));
}

// Buscar taxa de câmbio da AwesomeAPI
async function fetchExchangeRate(from, to) {
  try {
    const response = await axios.get(`https://economia.awesomeapi.com.br/json/last/${from}-${to}`);
    const rate = parseFloat(response.data[`${from}${to}`].bid);
    return rate;
  } catch (error) {
    throw new Error(`Erro ao buscar taxa de câmbio: ${error.message}`);
  }
}

// Converter moeda
async function convertCurrency(from, to, amount) {
  from = from.toUpperCase();
  to = to.toUpperCase();
  const cacheKey = `${from}_${to}`;
  
  let cache = await loadCache();
  let rate, cached = false;
  
  // Verificar se a taxa está em cache e ainda é válida
  if (cache[cacheKey] && (Date.now() - cache[cacheKey].timestamp) < CACHE_DURATION) {
    rate = cache[cacheKey].rate;
    cached = true;
  } else {
    // Buscar nova taxa da API
    rate = await fetchExchangeRate(from, to);
    
    // Atualizar cache
    cache[cacheKey] = {
      rate,
      timestamp: Date.now()
    };
    await saveCache(cache);
  }
  
  const convertedAmount = amount * rate;
  
  return {
    from,
    to,
    amount,
    converted: convertedAmount,
    rate,
    date: new Date().toISOString(),
    cached
  };
}

// Obter todas as taxas em cache
async function getCachedRates() {
  const cache = await loadCache();
  const rates = {};
  
  for (const [key, value] of Object.entries(cache)) {
    rates[key] = {
      rate: value.rate,
      last_updated: new Date(value.timestamp).toISOString()
    };
  }
  
  return rates;
}

module.exports = {
  convertCurrency,
  getCachedRates
};