"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
const axios_1 = __importDefault(require("axios"));
const app = (0, express_1.default)();
const port = 3000;
// Middleware to parse request body
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)());
// Serve static files
app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
app.get('/', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, 'public', 'index.html'));
});
app.get('/get-key-statistics', async (req, res) => {
    const stockSymbol = req.query.symbol; // Retrieve symbol from query parameter
    const options = {
        method: 'GET',
        url: `https://yahoo-finance127.p.rapidapi.com/key-statistics/${stockSymbol}`,
        headers: {
            'x-rapidapi-key': '1f9e13d339mshe750bb6a96aa643p185567jsnc318463dc050',
            'x-rapidapi-host': 'yahoo-finance127.p.rapidapi.com'
        }
    };
    try {
        const response = await axios_1.default.request(options);
        res.json(response.data);
    }
    catch (error) {
        console.error('Error with API request:', error.message);
        if (axios_1.default.isAxiosError(error) && error.response && error.response.status === 429) {
            res.status(429).send('API request limit exceeded. Please try again later.');
        }
        else {
            res.status(500).send('Error fetching key statistics');
        }
    }
});
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
