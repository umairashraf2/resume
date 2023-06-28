import {db} from '@vercel/postgres';
import {NextApiRequest, NextApiResponse} from 'next';

type Testimonial = {
  name: string;
  text: string;
  image: string;
};

type TestimonialWithImageSrc = {
  imageSrc: string;
  testimonials: Testimonial[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<TestimonialWithImageSrc | {message: string}>,
) {
  if (req.method === 'GET') {
    try {
      const client = await db.connect();
      const result = await client.query(`
        SELECT
          jsonb_build_object(
            'imageSrc', testimonial.imageSrc,
            'testimonials', jsonb_agg(jsonb_build_object(
              'text', testimonial_items.text,
              'name', testimonial_items.name,
              'image', testimonial_items.image
            ))
          ) AS result
        FROM
          testimonial
        JOIN
          testimonial_items ON testimonial.id = testimonial_items.testimonial_id
        GROUP BY
          testimonial.imageSrc;
      `);
      const testimonials: TestimonialWithImageSrc = result.rows[0].result
      client.release();
      res.status(200).json(testimonials);
    } catch (error) {
      console.error('Error retrieving testimonials:', error);
      res.status(500).json({message: 'Internal Server Error'});
    }
 
} else if (req.method === 'POST') {
  const testimonials:  Testimonial[] = req.body;

  if (!Array.isArray(testimonials)) {
    return res.status(400).json({message: 'Invalid request'});
  }

  const client = await db.connect();
  try {
    await client.query('BEGIN'); // Start transaction
    await client.query('TRUNCATE testimonial_items RESTART IDENTITY');


    for (const testimonial of testimonials) {
      if (!testimonial.name || !testimonial.text || !testimonial.image) {
        return res.status(400).json({message: 'Invalid request'});
      }

      await client.query('INSERT INTO testimonial_items (name, text, image, id) VALUES ($1, $2, $3, $4)', [
        testimonial.name,
        testimonial.text,
        testimonial.image,
        1
      ]);
    }

    await client.query('COMMIT');
    client.release();
    res.status(200).json({message: 'Data updated successfully'});
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error updating testimonials:', error);
    res.status(500).json({message: 'Internal Server Error'});
  }
}
 else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
