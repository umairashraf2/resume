import type {NextApiRequest, NextApiResponse} from 'next';

type Data = {
  message: string;
};

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const {method} = req;

  switch (method) {
    case 'POST':
      // For logout, you'd invalidate the session in a real world scenario
      res.setHeader('Set-Cookie', 'loggedIn=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT');
      res.status(200).json({message: 'Logged out'});
      break;
    default:
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
