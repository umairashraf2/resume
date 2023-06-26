import type {NextApiRequest, NextApiResponse} from 'next';
const fs = require('fs');
import path from 'path';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const {method} = req;

  switch (method) {
    case 'POST':
      const userData = req.body;
      const data = JSON.stringify(userData, null, 2);
      fs.writeFileSync(path.join(process.cwd(), 'src/data/socialLinks.json'), data, 'utf-8');
      res.status(200).json({message: 'Data updated successfully'});
      return;
    default:
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
