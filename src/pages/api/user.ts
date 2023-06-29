import {db} from '@vercel/postgres';
import {NextApiRequest, NextApiResponse} from 'next';

type AboutInfo = {
  label: string;
  text: string;
};

type AboutResponse = {
  profileImageSrc: string;
  description: string;
  aboutItems: AboutInfo[];
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<AboutResponse | {message: string}>) {
  if (req.method === 'GET') {
    try {
      const client = await db.connect();
      const result = await client.query(`
        SELECT
          c.profile_image_src as "profileImageSrc",
          c.description,
          jsonb_agg(jsonb_build_object(
            'label', ci.label,
            'text', ci.text
          )) as "aboutItems"
        FROM
          about c
          JOIN about_items ci ON c.id = ci.about_id
        GROUP BY
          c.profile_image_src, c.description;
      `);
      const aboutInfo: AboutResponse = result.rows[0];
      client.release();
      res.status(200).json(aboutInfo);
    } catch (error) {
      console.error('Error retrieving about information:', error);
      res.status(500).json({message: 'Internal Server Error'});
    }
    } else if (req.method === 'POST') {
    const aboutInfo = req.body;

    if (!aboutInfo.description || !Array.isArray(aboutInfo.aboutItems)) {
      return res.status(400).json({message: 'Invalid request'});
    }

    const {description, aboutItems} = aboutInfo;

    try {
      const client = await db.connect();
      await client.query('BEGIN'); // Start transaction

      // Truncate about_items table
      await client.query('TRUNCATE about_items RESTART IDENTITY');

      // Update description in about table. Assumes there's always one row.
      await client.query('UPDATE about SET description = $1;', [description]);

      // Get the about_id for insertion in about_items
      const aboutResult = await client.query('SELECT id FROM about;');
      const aboutId = aboutResult.rows[0].id;

      // Insert the new about items
      for (const item of aboutItems) {
        if (!item.label || !item.text) {
          await client.query('ROLLBACK');
          return res.status(400).json({message: 'Invalid request'});
        }

        await client.query('INSERT INTO about_items (about_id, label, text) VALUES ($1, $2, $3);', [
          aboutId,
          item.label,
          item.text,
        ]);
      }

      await client.query('COMMIT');
      client.release();
      res.status(200).json({message: 'Data updated successfully'});
    } catch (error) {
      console.error('Error updating about information:', error);
      res.status(500).json({message: 'Internal Server Error'});
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}