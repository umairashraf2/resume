import {db} from '@vercel/postgres';
import {NextApiRequest, NextApiResponse} from 'next';

type HeroResponse = {
  imageSrc: string;
  name: string;
  description: {
    paragraphs: {
      text: string;
      strong: {
        text: string;
        className: string;
      },
      text2: string;
      strong2: {
        text: string;
        className: string;
      },
      text3: string;
    }[];
  },
  actions: {
    href: string;
    text: string;
    primary: boolean;
  }[];
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<HeroResponse | {message: string}>) {
  if (req.method === 'GET') {
    try {
      const client = await db.connect();

      // Fetch the hero data
      const heroResult = await client.query('SELECT * FROM hero');
      const hero = heroResult.rows[0];

      // Fetch the paragraphs associated with the hero
      const paragraphsResult = await client.query('SELECT * FROM hero_paragraphs WHERE hero_id = $1', [hero.id]);
      const paragraphs = paragraphsResult.rows.map(p => ({
        text: p.text,
        strong: {
          text: p.strong_text,
          className: p.strong_classname,
        },
        text2: p.text2,
        strong2: {
          text: p.strong2_text,
          className: p.strong2_classname,
        },
        text3: p.text3,
      }));

      // Fetch the actions associated with the hero
      const actionsResult = await client.query('SELECT * FROM hero_actions WHERE hero_id = $1', [hero.id]);
      const actions = actionsResult.rows.map(a => ({
        href: a.href,
        text: a.text,
        primary: a.primary_action,
      }));

      client.release();

      res.status(200).json({
        imageSrc: hero.imageSrc,
        name: hero.name,
        description: {
          paragraphs,
        },
        actions,
      });
    } catch (error) {
      console.error('Error retrieving hero information:', error);
      res.status(500).json({message: 'Internal Server Error'});
    }
  }  else if (req.method === 'POST') {
  const heroInfo = req.body;

  // Validating request
  if (!heroInfo.name || !heroInfo.description || !Array.isArray(heroInfo.description.paragraphs)) {
    return res.status(400).json({message: 'Invalid request'});
  }

  const { name, description } = heroInfo;
  const paragraphs = description.paragraphs;
    
  try {
    const client = await db.connect();

    // Start transaction
    await client.query('BEGIN');

    // Truncate hero_paragraphs table
    await client.query('TRUNCATE hero_paragraphs RESTART IDENTITY');

    // Update name in hero table. Assumes there's always one row.
    await client.query('UPDATE hero SET name = $1 WHERE id = 1;', [name]);

    // Get the hero_id for insertion in hero_paragraphs
    const heroResult = await client.query('SELECT id FROM hero WHERE id = 1;');
    const heroId = heroResult.rows[0].id;

    // Insert the new paragraphs
    for (const item of paragraphs) {
      // Validate each paragraph item
      if (!item.text || !item.strong?.text || !item.strong?.className || !item.text2 || !item.strong2?.text || !item.strong2?.className || !item.text3) {
        await client.query('ROLLBACK');
        return res.status(400).json({message: 'Invalid request, missing paragraph data'});
      }

      await client.query(`
        INSERT INTO hero_paragraphs (hero_id, text, strong_text, strong_classname, text2, strong2_text, strong2_classname, text3) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8);`,
        [heroId, item.text, item.strong.text, item.strong.className, item.text2, item.strong2.text, item.strong2.className, item.text3]
      );
    }

    await client.query('COMMIT');
    client.release();

    return res.status(200).json({message: 'Data updated successfully'});

  } catch (error) {
      console.error('Error updating about information:', error);
      res.status(500).json({message: 'Internal Server Error'});
  }
} else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
