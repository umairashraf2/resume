import { db } from '@vercel/postgres';
import { NextApiRequest, NextApiResponse } from 'next';

type FormData = {
  name: string;
  email: string;
  message: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<{ message: string }>) {
  if (req.method === 'POST') {
    const formData: FormData = req.body;
    
    console.log('formData:', formData);

    if (!formData || !formData.name || !formData.email || !formData.message) {
      return res.status(400).json({ message: 'Invalid request' });
    }

    const client = await db.connect();

    try {
      await client.query(
        'INSERT INTO message (name, email, message, date) VALUES ($1, $2, $3, NOW());',
        [formData.name, formData.email, formData.message]
      );
    } catch (error) {
      console.error('Error inserting form data:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    } finally {
      client.release();
    }

    res.status(200).json({ message: 'Data inserted successfully' });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
