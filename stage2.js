const axios = require('axios');
const fs = require('fs');

const BASE_URL = 'http://35.200.185.69:8000/v1/autocomplete';

async function testAPI(query) {
    try {
        const response = await axios.get(`${BASE_URL}?query=${query}`);
        console.log(`Query: ${query} -> Response:`, response.data);
        fs.appendFileSync('api_responses_s2.log', `Query: ${query} -> ${JSON.stringify(response.data)}\n`);
    } catch (error) {
        console.error(`Error querying '${query}':`, error.response ? error.response.data : error.message);
        fs.appendFileSync('api_errors_s2.log', `Query: ${query} -> ${error.message}\n`);
    }
}

// Character-wise exploration (a-z, aa, ab, etc.)
async function exploreCharacters() {
    const alphabet = 'abcdefghijklmnopqrstuvwxyz';
    for (let char1 of alphabet) {
        await testAPI(char1);
        for (let char2 of alphabet) {
            await testAPI(char1 + char2);
        }
    }
}

exploreCharacters();
