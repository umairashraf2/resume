import { db } from '@vercel/postgres';
import { NextApiRequest, NextApiResponse } from 'next';

type SocialLink = {
  label: string;
  icon: string;
  href: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SocialLink[] | { message: string }>,
) {
  if (req.method === 'GET') {
    try {
      const client = await db.connect();
      const result = await client.query('SELECT * FROM social_link;');
      const socialLinks: SocialLink[] = result.rows;
      client.release();
      res.status(200).json(socialLinks);
    } catch (error) {
      console.error('Error retrieving social links:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  } else if (req.method === 'POST') {
    const { label, icon, href } = req.body;

    if (!label || !icon || !href) {
      return res.status(400).json({ message: 'Invalid request' });
    }

    try {
      const client = await db.connect();
      await client.query('INSERT INTO social_link (label, icon, href) VALUES ($1, $2, $3);', [label, icon, href]);
      client.release();
      res.status(200).json({ message: 'Data updated successfully' });
    } catch (error) {
      console.error('Error updating social links:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
