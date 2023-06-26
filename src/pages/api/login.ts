import type {NextApiRequest, NextApiResponse} from 'next';

type Data = {
  message: string;
};

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const {method} = req;

  switch (method) {
    case 'POST':
      // Insert your own authentication mechanism here. For example,
      // you can check the username and password in your database.
      const {username, password} = req.body;

      if (username === 'daniel' && password === 'daniel[111]') {
        // Normally you wouldn't store the logged in user status in a cookie like this
        // You would have some kind of session handling here
        res.setHeader('Set-Cookie', 'loggedIn=true; Path=/;');
        res.status(200).json({message: 'Logged in'});
      } else {
        res.status(401).json({message: 'Unauthorized'});
      }
      break;
    default:
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
