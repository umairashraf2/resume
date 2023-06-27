import {db} from '@vercel/postgres';
import {NextApiRequest, NextApiResponse} from 'next';

type Data = {
  message: string;
};

export default async function handler(request: NextApiRequest, response: NextApiResponse<Data>) {
  if (request.method !== 'POST') {
    return response.status(405).end(`Method ${request.method} Not Allowed`);
  }

  const {username, password} = request.body;

  if (!username || !password) {
    return response.status(400).json({message: 'Invalid request'});
  }

  const client = await db.connect();

  try {
    const result = await client.sql`SELECT * FROM login WHERE username = ${username} AND password = ${password};`;

    if (result.rowCount === 1) {
      response.setHeader('Set-Cookie', 'loggedIn=true; Path=/;');
      response.status(200).json({message: 'Logged in'});
    } else {
      response.status(401).json({message: 'Unauthorized'});
    }
  } catch (error) {
    response.status(500).json({message: 'Internal Server Error'});
  } finally {
    client.release();
  }
}
