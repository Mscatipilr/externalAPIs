import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import cors from 'cors';
import axios, { AxiosRequestConfig } from 'axios';

const app = express();
const port = 3000;

// Middleware to parse request body
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

interface KeyStatisticsResponse {
  access_control_allow_credentials: boolean;
  access_control_allow_origin: string;
  age: number;
  cache_control: string;
  content_length: number;
  content_type: string;
  date: Date;
  etag: string;
  server: string;
  strict_transport_security: string;
  x_powered_by: string;
  x_rapidapi_region: string;
  x_rapidapi_version: string;
  x_ratelimit_rapid_free_plans_hard_limit_limit: number;
  x_ratelimit_rapid_free_plans_hard_limit_remaining: number;
  x_ratelimit_rapid_free_plans_hard_limit_reset: number;
  x_ratelimit_requests_limit: number;
  x_ratelimit_requests_remaining: number;
  x_ratelimit_requests_reset: number;
  x_vercel_cache: string;
  x_vercel_id: string;
}


app.get('/get-key-statistics', async (req: Request, res: Response) => {
  const stockSymbol = req.query.symbol as string; // Retrieve symbol from query parameter
  const options: AxiosRequestConfig = {
    method: 'GET',
    url: `https://yahoo-finance127.p.rapidapi.com/key-statistics/${stockSymbol}`,
    headers: {
      'x-rapidapi-key': '1f9e13d339mshe750bb6a96aa643p185567jsnc318463dc050',
      'x-rapidapi-host': 'yahoo-finance127.p.rapidapi.com'
    }
  };

  try {
    const response = await axios.request<KeyStatisticsResponse>(options);
    res.json(response.data);
  } catch (error) {
    console.error('Error with API request:', (error as Error).message);
    if (axios.isAxiosError(error) && error.response && error.response.status === 429) {
      res.status(429).send('API request limit exceeded. Please try again later.');
    } else {
      res.status(500).send('Error fetching key statistics');
    }
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
