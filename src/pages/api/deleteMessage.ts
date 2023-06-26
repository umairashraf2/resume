import { NextApiRequest, NextApiResponse } from "next";
const fs = require('fs');
import path from "path";
import { promisify } from "util";

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'DELETE') {
    const { id } = req.query;

    try {
      const filePath = path.resolve('./src/data/messages.json');

      // Read current contents of the file
      const currentContents = await readFile(filePath, 'utf8');

      // Parse it as JSON
      let data = JSON.parse(currentContents);

      // Find the index of the message with the given ID
      const messageIndex = data.findIndex((message: any) => message.id === id);

      // If no message was found, return an error
      if (messageIndex === -1) {
        return res.status(400).json({ error: "No message with given ID." });
      }

      // Remove the message from the array
      data.splice(messageIndex, 1);

      // Write the updated data back to the file
      await writeFile(filePath, JSON.stringify(data), 'utf8');

      // Send a 200 response
      res.status(200).json({ status: 'success', message: 'Message deleted successfully.' });
    } catch (error:any) {
      // If an error occurred, send a 500 response with the error message
      res.status(500).json({ error: error.message });
    }
  } else {
    // If the request method is not DELETE, send a 405 response
    res.status(405).json({ error: 'Method not allowed. Please send a DELETE request.' });
  }
};

export default handler;
