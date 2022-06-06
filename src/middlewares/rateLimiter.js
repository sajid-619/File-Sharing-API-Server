const rateLimit = require("express-rate-limit");

//Configurable daily download/upload limit
const WINDOW_DURATION_IN_HOURS = 24 * 60 * 60 * 1000;
const MAX_WINDOW_REQUEST_COUNT = 100;

const rateLimiter = rateLimit({
    max: MAX_WINDOW_REQUEST_COUNT,                          // Limit each IP to 100 requests 
    windowMs: WINDOW_DURATION_IN_HOURS,                    // per `window` (here, per 24 hours)
    message: "Too many requests from this IP!!! Please try again later."
});

module.exports = { rateLimiter }