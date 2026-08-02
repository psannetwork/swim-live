const fs = require('fs');

function analyzeHar(filename) {
    if (!fs.existsSync(filename)) return;
    console.log(`\n=== Analyzing ${filename} ===`);
    const data = JSON.parse(fs.readFileSync(filename, 'utf8'));
    const entries = data.log.entries;
    const apiCalls = entries.filter(e => e.request.url.includes('api'));
    
    const endpoints = new Set();
    apiCalls.forEach(e => {
        const url = new URL(e.request.url);
        endpoints.add(e.request.method + ' ' + url.pathname);
    });
    
    console.log(Array.from(endpoints).join('\n'));
    
    // Sample response from one API call
    if (apiCalls.length > 0) {
        console.log('\nSample Response from: ' + apiCalls[0].request.url);
        const text = apiCalls[0].response.content.text;
        if (text) {
            console.log(text.substring(0, 500));
        } else {
            console.log('No text content in response.');
        }
    }
}

['har1.har', 'har2.har', 'result.swim.or.jp.har'].forEach(analyzeHar);
