import {db} from '@vercel/postgres';
import {NextApiRequest, NextApiResponse} from 'next';

type Experience = {
  date: string;
  location: string;
  title: string;
  content: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Experience[] | {message: string}>) {
  if (req.method === 'GET') {
    try {
      const client = await db.connect();
      const result = await client.query('SELECT * FROM work_experience;');
      console.log(999,result.rows)
      const experienceData: Experience[] = result.rows;
      client.release();
      res.status(200).json(experienceData);
    } catch (error) {
      console.error('Error retrieving experience data:', error);
      res.status(500).json({message: 'Internal Server Error'});
    }
  } else if (req.method === 'POST') {
    const { date, location, title, content} = req.body[0];

    if (!date || !location || !title || !content) {
      return res.status(400).json({message: 'Invalid request'});
    }

    try {
      const client = await db.connect();
      await client.query(
        'UPDATE work_experience SET date = $1, location = $2, title = $3, content = $4 WHERE id = $5;',
        [date, location, title, content, 1], // Replace 1 with the appropriate ID value of the row you want to update
      );
      client.release();
      res.status(200).json({message: 'Data updated successfully'});
    } catch (error) {
      console.error('Error updating experience data:', error);
      res.status(500).json({message: 'Internal Server Error'});
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
