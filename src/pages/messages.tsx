import {useEffect, useState} from 'react';
import Navbar from '../components/Admin/Navbar';

interface FormData {
  id: string;
  name: string;
  date: string;
  email: string;
  message: string;
}

export default function Messages() {
  const [messages, setMessages] = useState<FormData[]>([]);

  useEffect(() => {
    fetch('/api/messages')
      .then(response => response.json())
      .then(data => setMessages(data.messages));
  }, []);

  const handleDelete = async (id: string) => {
    try {
      // Make the DELETE request
      const response = await fetch(`/api/deleteMessage?id=${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete message');
      }

      // Remove the deleted message from the state
      setMessages(messages.filter(message => message.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4">
        {messages.length === 1 ? (
          <h1 className="my-6 text-center text-2xl text-white">{messages.length} Message</h1>
        ) : (
          <h1 className="my-6 text-center text-2xl text-white">{messages.length} Messages</h1>
        )}
        {messages.length === 0 ? (
          <p className="my-8 text-center text-2xl font-bold">No messages yet.</p>
        ) : (
          messages.map(message => (
            <div key={message.id} className="mb-4 rounded-md bg-white p-4 shadow">
              <h2 className="mb-2 text-xl font-bold">{message.name}</h2>
              <p className="mb-2">
                <span className="font-bold">Date:</span> {message.date}
              </p>
              <p className="mb-2">
                <span className="font-bold">Email:</span> {message.email}
              </p>
              <p>
                <span className="font-bold">Message:</span> {message.message}
              </p>
              <button onClick={() => handleDelete(message.id)} className="mt-4 rounded bg-red-500 px-4 py-2 text-white">
                Delete Message
              </button>
            </div>
          ))
        )}
      </div>
    </>
  );
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
