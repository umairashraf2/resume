import {db} from '@vercel/postgres';
import {NextApiRequest, NextApiResponse} from 'next';

type Testimonial = {
  name: string;
  text: string;
  image: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Testimonial[] | {message: string}>) {
  if (req.method === 'GET') {
    try {
      const client = await db.connect();
      const result = await client.query('SELECT * FROM testimonial_items;');
      const testimonials: Testimonial[] = result.rows;
      client.release();
      res.status(200).json(testimonials);
    } catch (error) {
      console.error('Error retrieving testimonials:', error);
      res.status(500).json({message: 'Internal Server Error'});
    }
  } else if (req.method === 'POST') {
    const testimonials = req.body;

    if (!Array.isArray(testimonials)) {
      return res.status(400).json({message: 'Invalid request'});
    }
    const client = await db.connect();
    await client.query('BEGIN'); // Start transaction
    // delete all rows
    await client.query('TRUNCATE testimonial_items RESTART IDENTITY');
    for (const testimonial of testimonials) {
      if (!testimonial.name || !testimonial.text || !testimonial.image) {
        return res.status(400).json({message: 'Invalid request'});
      }

      try {
        await client.query('INSERT INTO testimonial_items (name, text, image) VALUES ($1, $2, $3);', [
          testimonial.name,
          testimonial.text,
          testimonial.image,
        ]);
      } catch (error) {
        console.error('Error updating testimonials:', error);
        res.status(500).json({message: 'Internal Server Error'});
      }
    }
    await client.query('COMMIT')
    client.release();
    res.status(200).json({message: 'Data updated successfully'});
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
