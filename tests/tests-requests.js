const axios = require('axios');

async function testAPI() {
  try {
    const response = await axios.get('http://localhost:3000/api/rates');
    console.log('✅ API está funcionando! Status:', response.status);
  } catch (error) {
    console.log('❌ API não está respondendo:', error.message);
  }
}

testAPI();