import {useState} from 'react';
import {useRouter} from 'next/router'; // import useRouter

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const router = useRouter(); // use useRouter hook

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({username, password}),
      });

      if (res.ok) {
        // if the response is ok, redirect to admin page
        router.push('/admin');
      } else {
        alert('Failed to log in');
      }
    } catch (error) {
      console.error('An unexpected error happened:', error);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md">
        <form onSubmit={handleSubmit} className="mb-4 rounded-lg bg-white px-8 pb-8 pt-6 shadow-lg">
          <div className="mb-4">
            <label className="mb-2 block text-sm font-bold text-gray-700">Username</label>
            <input
              className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Username"
            />
          </div>
          <div className="mb-6">
            <label className="mb-2 block text-sm font-bold text-gray-700">Password</label>
            <input
              className="focus:shadow-outline mb-3 w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Password"
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className="focus:shadow-outline rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none"
              type="submit">
              Log in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export async function getServerSideProps(context:any) {
  const { loggedIn } = context.req.cookies;
  
  if (loggedIn) {
    return {
      redirect: {
        destination: '/admin',
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}