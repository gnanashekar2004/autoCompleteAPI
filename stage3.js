const axios = require('axios');
const fs = require('fs');

const BASE_URL = 'http://35.200.185.69:8000/v1/autocomplete';
const RATE_LIMIT_DELAY = 200; // Adjust based on API response

async function testAPI(query) {
    try {
        const response = await axios.get(`${BASE_URL}?query=${query}`);
        console.log(`Query: ${query} -> Response:`, response.data);
        fs.appendFileSync('api_responses_s3.log', `Query: ${query} -> ${JSON.stringify(response.data)}\n`);
    } catch (error) {
        console.error(`Error querying '${query}':`, error.response ? error.response.data : error.message);
        fs.appendFileSync('api_errors_s3.log', `Query: ${query} -> ${error.message}\n`);
        if (error.response && error.response.status === 429) {
            console.log(`Rate limit hit. Retrying after delay...`);
            await new Promise(resolve => setTimeout(resolve, RATE_LIMIT_DELAY));
            return testAPI(query);
        }
    }
}

// Character-wise exploration with rate limit handling
async function exploreCharacters() {
    const alphabet = 'abcdefghijklmnopqrstuvwxyz';
    for (let char1 of alphabet) {
        await testAPI(char1);
        await new Promise(resolve => setTimeout(resolve, RATE_LIMIT_DELAY));
        for (let char2 of alphabet) {
            await testAPI(char1 + char2);
            await new Promise(resolve => setTimeout(resolve, RATE_LIMIT_DELAY));
        }
    }
}

exploreCharacters();
