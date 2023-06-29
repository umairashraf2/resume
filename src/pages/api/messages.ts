import { db } from '@vercel/postgres';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse<{ messages: string[] }>) {
  if (req.method === 'GET') {
    const client = await db.connect();

    try {
      const result = await client.query('SELECT * FROM message;');
      const messages = result.rows;
      res.status(200).json({ messages });
    } catch (error) {
      console.error('Error retrieving messages:', error);
      res.status(500).json({ messages: ['Internal Server Error'] });

    } finally {
      client.release();
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
