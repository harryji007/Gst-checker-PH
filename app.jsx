// Importing required libraries
import axios from 'axios';
import { parse } from 'json2csv';

// Function to validate GSTIN format
function isValidGSTIN(gstin) {
    const gstinRegex = /^[0-9]{2}[A-Z]{4}[0-9]{4}[A-Z][0-9A-Z][Z][0-9A-Z]{1}$/;
    return gstinRegex.test(gstin);
}

// Function to check active status via Claude API
async function checkActiveStatus(gstin) {
    const response = await axios.get(`https://api.claude.ai/gst-status/${gstin}`);
    return response.data.activeStatus;
}

// Function to process GSTINs in bulk
async function processGSTINs(gstins) {
    const results = [];

    for (const gstin of gstins) {
        if (!isValidGSTIN(gstin)) {
            results.push({ gstin, status: 'Invalid GSTIN Format' });
            continue;
        }

        const status = await checkActiveStatus(gstin);
        results.push({ gstin, status });
    }

    return results;
}

// Function to export results to CSV
function exportToCSV(results) {
    const csv = parse(results);
    require('fs').writeFileSync('gst_status_results.csv', csv);
}

// Main function to run the checker
async function main() {
    const gstins = ['22ABCDE1234F1Z5', '23ABCDE1234F2Z6'];  // Sample GSTIN Array
    const results = await processGSTINs(gstins);

    console.log('Processing complete', results);
    exportToCSV(results);
}

main();