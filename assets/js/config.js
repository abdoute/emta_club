/**
 * Global API Configuration
 * Centralizes the API base URL logic for the entire application.
 */
(function () {
    'use strict';

    // Determine if running locally
    var isLocal = location.hostname === '127.0.0.1' ||
        location.hostname === 'localhost' ||
        location.protocol === 'file:';

    // Define base URLs
    var localBase = 'http://127.0.0.1:5592';
    var prodBase = 'https://emtaclub-production.up.railway.app';

    // Set global API base
    // You can override this by setting localStorage item 'emta_api_base'
    var storedBase = localStorage.getItem('emta_api_base');

    window.EMTA_API_BASE = storedBase || (isLocal ? localBase : prodBase);
    window.API_BASE = window.EMTA_API_BASE;

    console.log('API Config Loaded:', window.EMTA_API_BASE);
})();
