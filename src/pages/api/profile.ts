import type {NextApiRequest, NextApiResponse} from 'next';
const fs = require('fs');
import path from 'path';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const data = fs.readFileSync(path.join(process.cwd(), 'src/data/heroData.json'), 'utf-8');
    const userData = JSON.parse(data);
    res.status(200).json(userData);
  } else if (req.method === 'POST') {
    const userData = req.body;
    const data = JSON.stringify(userData, null, 2);
    fs.writeFileSync(path.join(process.cwd(), 'src/data/heroData.json'), data, 'utf-8');
    res.status(200).json({message: 'Data updated successfully'});
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
