import type {NextApiRequest, NextApiResponse} from 'next';

import { db } from '@vercel/postgres';

type Skill = {
  name: string;
  level: number;
};

type SkillCategory = {
  name: string;
  skills: Skill[];
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<SkillCategory[] | {message: string}>) {
  if (req.method === 'GET') {
    try {
      const client = await db.connect();
      const result = await client.query(`
        SELECT
          category AS name,
          json_agg(json_build_object('name', name, 'level', level)) AS skills
        FROM
          skill
        GROUP BY
          category
      `);

      const skillCategories: SkillCategory[] = result.rows;

      client.release();
      res.status(200).json(skillCategories);
    } catch (error) {
      console.error('Error retrieving skills data:', error);
      res.status(500).json({message: 'Internal Server Error'});
    }
  } else if (req.method === 'POST') {
    const skillCategories = req.body;

    if (!Array.isArray(skillCategories)) {
      return res.status(400).json({ message: 'Invalid request' });
    }

    try {
      const client = await db.connect();

      // Start a transaction to ensure data integrity
      await client.query('BEGIN');

      // delete all rows
    await client.query('TRUNCATE skill RESTART IDENTITY');

      // Insert new skill data
      for (const category of skillCategories) {
        const { name, skills } = category;

        if (!name || !Array.isArray(skills)) {
          throw new Error('Invalid skill category data');
        }

        for (const skill of skills) {
          const { name: skillName, level } = skill;

          if (!skillName || typeof level !== 'number') {
            throw new Error('Invalid skill data');
          }

          await client.query('INSERT INTO skill (name, level, category) VALUES ($1, $2, $3)', [skillName, level, name]);
        }
      }

      // Commit the transaction
      await client.query('COMMIT');

      client.release();
      res.status(200).json({ message: 'Data updated successfully' });
    } catch (error) {
      console.error('Error updating skills data:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
