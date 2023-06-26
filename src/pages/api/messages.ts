import { NextApiRequest, NextApiResponse } from "next";
const fs = require('fs');
import path from 'path';
import { promisify } from 'util';

const readFile = promisify(fs.readFile);

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    try {
      // Read the data from the JSON file
      const data = await readFile(path.resolve('./src/data/messages.json'), 'utf8');

      // Parse the data as JSON and send it in the response
      const jsonData = JSON.parse(data);
      res.status(200).json(jsonData);
    } catch (error:any) {
      // If an error occurred, send a 500 response with the error message
      res.status(500).json({ error: error.message });
    }
  } else {
    // If the request method is not GET, send a 405 response
    res.status(405).json({ error: 'Method not allowed. Please send a GET request.' });
  }
};

export default handler;
