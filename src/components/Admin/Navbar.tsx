import {useRouter} from 'next/router';
import Link from 'next/link';

const Navbar = () => {
  const router = useRouter();

  const handleLogout = async () => {
    const res = await fetch('/api/logout', {
      method: 'POST',
    });

    if (res.ok) {
      router.push('/login');
    } else {
      alert('Failed to log out');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between bg-neutral-900/50 p-3">
        <h1 className="text-4xl font-bold text-white">
          <Link href="/admin">Admin Panel</Link>
        </h1>
        <button
          className="focus:shadow-outline rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none"
          onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;
