import {useRouter} from 'next/router';
import {useEffect} from 'react';

export default function Logout() {
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const res = await fetch('/api/logout', {
        method: 'POST',
      });

      if (res.ok) {
        alert('Logged out!');
        router.push('/login');
      } else {
        alert('Failed to log out');
      }
    })();
  }, []);

  return <p>Logging out...</p>;
}

export async function getServerSideProps(context: any) {
  const {loggedIn} = context.req.cookies;

  if (!loggedIn) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}
