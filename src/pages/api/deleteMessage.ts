import { db } from '@vercel/postgres';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse<{ message: string }>) {
  if (req.method === 'DELETE') {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ message: 'Invalid request' });
    }

    const client = await db.connect();

    try {
      await client.query('DELETE FROM message WHERE id = $1;', [id]);
    } catch (error) {
      console.error('Error deleting message:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    } finally {
      client.release();
    }

    res.status(200).json({ message: 'Message deleted successfully' });
  } else {
    res.setHeader('Allow', ['DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
