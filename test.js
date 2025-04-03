// apiTest.js
const https = require('https');
const http = require('http');

// API URL
const API_URL = 'https://api.quotable.io/quotes';

// Create an HTTPS agent that ignores certificate errors
const agent = new https.Agent({
  rejectUnauthorized: false
});

// Function to make a GET request
function makeRequest(url) {
  return new Promise((resolve, reject) => {
    // Parse the URL to determine if it's HTTP or HTTPS
    const protocol = url.startsWith('https') ? https : http;
    
    console.log(`Making request to: ${url}`);
    const startTime = Date.now();
    
    const request = protocol.get(url, { agent }, (response) => {
      let data = '';
      
      // Handle response data
      response.on('data', (chunk) => {
        data += chunk;
      });
      
      // When the response is complete
      response.on('end', () => {
        const endTime = Date.now();
        console.log(`Request completed in ${endTime - startTime}ms with status ${response.statusCode}`);
        
        if (response.statusCode >= 200 && response.statusCode < 300) {
          try {
            const parsedData = JSON.parse(data);
            resolve(parsedData);
          } catch (error) {
            console.error('Error parsing JSON response:', error);
            reject(error);
          }
        } else {
          console.error(`Request failed with status code: ${response.statusCode}`);
          reject(new Error(`Request failed with status code: ${response.statusCode}`));
        }
      });
    });
    
    // Handle request errors
    request.on('error', (error) => {
      console.error('Request error:', error);
      reject(error);
    });
    
    // Set timeout
    request.setTimeout(10000, () => {
      request.abort();
      reject(new Error('Request timed out after 10 seconds'));
    });
  });
}

// Function to generate query string
function generateQueryString(params) {
  if (!params) return '';
  
  const queryParts = [];
  for (const key in params) {
    if (params.hasOwnProperty(key)) {
      queryParts.push(`${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`);
    }
  }
  
  return queryParts.length > 0 ? `?${queryParts.join('&')}` : '';
}

// Function to get quotes with parameters
async function getQuotes(params) {
  const url = `${API_URL}${generateQueryString(params)}`;
  return makeRequest(url);
}

// Test functions
async function runTests() {
  try {
    console.log('==== Testing Quotable API ====');
    
    // Test 1: Get default quotes
    console.log('\nTest 1: Fetching default quotes...');
    const quotes = await getQuotes();
    console.log(`✅ Retrieved ${quotes.results.length} quotes`);
    console.log('Sample quote:', JSON.stringify(quotes.results[0], null, 2));
    
    // Test 2: Get quotes by author
    console.log('\nTest 2: Fetching quotes by author...');
    const authorQuotes = await getQuotes({ author: 'Albert Einstein' });
    console.log(`✅ Retrieved ${authorQuotes.results.length} quotes by Albert Einstein`);
    if (authorQuotes.results.length > 0) {
      console.log('Sample quote:', JSON.stringify(authorQuotes.results[0], null, 2));
    }
    
    // Test 3: Get quotes by tag
    console.log('\nTest 3: Fetching quotes by tag...');
    const tagQuotes = await getQuotes({ tags: 'wisdom' });
    console.log(`✅ Retrieved ${tagQuotes.results.length} quotes with tag 'wisdom'`);
    if (tagQuotes.results.length > 0) {
      console.log('Sample quote:', JSON.stringify(tagQuotes.results[0], null, 2));
    }
    
    // Test 4: Get quotes with multiple parameters
    console.log('\nTest 4: Fetching quotes with multiple parameters...');
    const filteredQuotes = await getQuotes({ 
      maxLength: 100,
      limit: 5,
      page: 1
    });
    console.log(`✅ Retrieved ${filteredQuotes.results.length} short quotes`);
    if (filteredQuotes.results.length > 0) {
      console.log('Sample quote:', JSON.stringify(filteredQuotes.results[0], null, 2));
    }
    
    console.log('\nAll tests completed successfully! ✨');
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the tests
runTests();