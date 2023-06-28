import {db} from '@vercel/postgres';
import {NextApiRequest, NextApiResponse} from 'next';

type ContactInfo = {
  type: string;
  text: string;
  href: string;
};

type ContactResponse = {
  headerText: string;
  description: string;
  items: ContactInfo[];
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<ContactResponse | {message: string}>) {
  if (req.method === 'GET') {
    try {
      const client = await db.connect();
      const result = await client.query(`
        SELECT
          c.header_text as "headerText",
          c.description,
          jsonb_agg(jsonb_build_object(
            'type', ci.type,
            'text', ci.text,
            'href', ci.href
          )) as items
        FROM
          contact c
          JOIN contact_items ci ON c.id = ci.contact_id
        GROUP BY
          c.header_text, c.description;
      `);
      const contactInfo: ContactResponse = result.rows[0];
      client.release();
      res.status(200).json(contactInfo);
    } catch (error) {
      console.error('Error retrieving contact information:', error);
      res.status(500).json({message: 'Internal Server Error'});
    }
  } else if (req.method === 'POST') {
    const contactInfo = req.body;

    if (!contactInfo.headerText || !contactInfo.description || !Array.isArray(contactInfo.items)) {
      return res.status(400).json({message: 'Invalid request'});
    }

    const {headerText, description, items} = contactInfo;

    try {
      const client = await db.connect();
      await client.query('BEGIN'); // Start transaction

      // Delete all rows from both tables
      await client.query('TRUNCATE contact_items, contact RESTART IDENTITY');

      // Insert the new contact information
      const contactResult = await client.query(
        'INSERT INTO contact (header_text, description) VALUES ($1, $2) RETURNING id;',
        [headerText, description],
      );
      const contactId = contactResult.rows[0].id;

      // Insert the new contact items
      for (const item of items) {
        if (!item.type || !item.text || !item.href) {
          await client.query('ROLLBACK');
          return res.status(400).json({message: 'Invalid request'});
        }

        await client.query('INSERT INTO contact_items (contact_id, type, text, href) VALUES ($1, $2, $3, $4);', [
          contactId,
          item.type,
          item.text,
          item.href,
        ]);
      }

      await client.query('COMMIT');
      client.release();
      res.status(200).json({message: 'Data updated successfully'});
    } catch (error) {
      console.error('Error updating contact information:', error);
      res.status(500).json({message: 'Internal Server Error'});
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
