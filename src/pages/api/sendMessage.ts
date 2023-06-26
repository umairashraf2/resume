import {NextApiRequest, NextApiResponse} from 'next';
import { v4 as uuidv4 } from 'uuid';
const fs = require('fs');
import path from 'path';
import {promisify} from 'util';

const appendFile = promisify(fs.appendFile);
const readFile = promisify(fs.readFile);

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const {name, email, message} = req.body;
    try {
      const filePath = path.resolve('./src/data/messages.json');

      // Check if messages.json exists, if not create an initial empty array in the file
      if (!fs.existsSync(filePath)) {
        await appendFile(filePath, JSON.stringify([]));
      }

      // Read current contents of the file
      const currentContents = await readFile(filePath, 'utf8');

      // Parse it as JSON
      const data = JSON.parse(currentContents);

      // Add the new message with a UUID and the current date to the array
      data.push({
        id: uuidv4(),
        date: new Date().toLocaleString(),
        name, 
        email, 
        message
      });

      // Write the updated data back to the file
      await fs.promises.writeFile(filePath, JSON.stringify(data), 'utf8');

      // Send a 200 response
      res.status(200).json({status: 'success', message: 'Message saved successfully'});
    } catch (error:any) {
      // If an error occurred, send a 500 response with the error message
      res.status(500).json({error: error.message});
    }
  } else {
    // If the request method is not POST, send a 405 response
    res.status(405).json({error: 'Method not allowed. Please send a POST request.'});
  }
};

export default handler;
