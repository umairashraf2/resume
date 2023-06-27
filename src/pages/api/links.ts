import {db} from '@vercel/postgres';
import {NextApiRequest, NextApiResponse} from 'next';

type SocialLink = {
  label: string;
  icon: string;
  href: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<SocialLink[] | {message: string}>) {
  if (req.method === 'GET') {
    try {
      const client = await db.connect();
      const result = await client.query('SELECT * FROM social_link;');
      const socialLinks: SocialLink[] = result.rows;
      client.release();
      res.status(200).json(socialLinks);
    } catch (error) {
      console.error('Error retrieving social links:', error);
      res.status(500).json({message: 'Internal Server Error'});
    }
  } else if (req.method === 'POST') {
    const socialLinks = req.body;

    if (!Array.isArray(socialLinks)) {
      return res.status(400).json({message: 'Invalid request'});
    }
    const client = await db.connect();
    for (const link of socialLinks) {
      if (!link.label || !link.icon || !link.href) {
        return res.status(400).json({message: 'Invalid request'});
      }

      try {
        // delete all rows
        await client.query('TRUNCATE social_link RESTART IDENTITY');
        await client.query('INSERT INTO social_link (label, icon, href) VALUES ($1, $2, $3);', [
          link.label,
          link.icon,
          link.href,
        ]);
      } catch (error) {
        console.error('Error updating social links:', error);
        res.status(500).json({message: 'Internal Server Error'});
      }
    }
    client.release();
    res.status(200).json({message: 'Data updated successfully'});
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
