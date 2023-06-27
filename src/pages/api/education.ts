import {NextApiRequest, NextApiResponse} from 'next';
import {db} from '@vercel/postgres';

type Education = {
  id: number;
  date: string;
  location: string;
  degree: string;
  field: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Education[] | {message: string}>) {
  if (req.method === 'GET') {
    try {
      const client = await db.connect();
      const result = await client.query('SELECT * FROM education;');
      const educationData: Education[] = result.rows;
      client.release();
      res.status(200).json(educationData);
    } catch (error) {
      console.error('Error retrieving education data:', error);
      res.status(500).json({message: 'Internal Server Error'});
    }
  } else if (req.method === 'POST') {
    const {id, date, location, title, content} = req.body[0];
    console.log(req.body[0])

    if (!id || !date || !location || !title || !content) {
      return res.status(400).json({message: 'Invalid request'});
    }

    try {
      const client = await db.connect();
      await client.query('UPDATE education SET date = $2, location = $3, title = $4, content = $5 WHERE id = $1;', [
        id,
        date,
        location,
        title,
        content,
      ]);
      client.release();
      res.status(200).json({message: 'Data updated successfully'});
    } catch (error) {
      console.error('Error updating education data:', error);
      res.status(500).json({message: 'Internal Server Error'});
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
