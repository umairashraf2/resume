import React, { FormEvent, useState } from 'react';
import {  NextPage } from 'next';
import AdminPanel from '../components/Admin/AdminPanel';
import Link from 'next/link'
import Navbar from "../components/Admin/Navbar"
import Head from 'next/head';

type ServerSideProps = {
  loggedIn: boolean;
}

const Admin: NextPage<ServerSideProps> = () => {
  const [message, setMessage] = useState<string>('');

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const target = event.target as typeof event.target & {
      file: { files: FileList }
    };
    const file = target.file.files[0];
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });
    const data = await response.json();
    setMessage(data.message);
  };
  

  return (
    <div>
      <Head>
        <title>Admin | Daniel Resume</title>
        <link href="/fav.jpg" rel="icon" />
      </Head>
      <Navbar />
      <div className="my-4 flex justify-center">
        <button className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700">
          <Link href="/">Home</Link>
        </button>
      </div>
      <div className="my-4 flex justify-center">
        <button className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700">
          <Link href="/messages">See Messages</Link>
        </button>
      </div>

      <h1 className="my-4 text-center text-xl text-white">Resume Upload Form</h1>

      <div className="flex flex-col items-center justify-center p-2">
        <div className="flex items-center rounded-lg bg-white p-6 shadow-lg">
          <form onSubmit={handleSubmit} className="flex items-center space-x-3">
            <div className="flex items-center rounded-lg border-2 border-gray-300 bg-gray-100 p-2 text-gray-500 focus-within:border-blue-500 focus-within:text-gray-600">
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 10h16M4 14h16M4 18h16"></path>
              </svg>
              <input
                type="file"
                name="file"
                accept=".pdf"
                className="w-full bg-gray-100 pl-2 text-sm text-gray-900 outline-none"
              />
            </div>
            <button
              type="submit"
              className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:outline-none active:bg-blue-700">
              Upload
            </button>
          </form>
        </div>
        {message && <p className="mt-4 text-center text-xl text-green-500">{message}</p>}
      </div>

      <AdminPanel />
    </div>
  );
};

export async function getServerSideProps(context:any) {
  const { loggedIn } = context.req.cookies;
  
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

export default Admin;
