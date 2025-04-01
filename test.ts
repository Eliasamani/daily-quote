import getQuotes from './src/api';

// Test basic quote fetching
async function testGetQuotes() {
  try {
    console.log('Testing Quotable API...');
    
    // Get default quotes
    const quotes = await getQuotes();
    console.log(`✅ Retrieved ${quotes.length} quotes`);
    console.log('Sample quote:', JSON.stringify(quotes[0], null, 2));
    
    // Get quotes with parameters
    const filteredQuotes = await getQuotes({ 
      author: 'Albert Einstein',
      limit: 5 
    });
    console.log(`✅ Retrieved ${filteredQuotes.length} filtered quotes by Albert Einstein`);
    
    if (filteredQuotes.length > 0) {
      console.log('Sample filtered quote:', JSON.stringify(filteredQuotes[0], null, 2));
    } else {
      console.log('No quotes found for the specified author');
    }
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
testGetQuotes();