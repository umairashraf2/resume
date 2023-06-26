import React, {useState, useEffect} from 'react';

interface User {
  profileImageSrc: string;
  description: string;
  aboutItems: any[];
}

const UserForm: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  useEffect(() => {
    fetch('/api/user')
      .then(response => response.json())
      .then(data => setUser(data));
  }, []);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    fetch('/api/user', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(user),
    }).then(response => {
      if (response.ok) {
        setSaveSuccess(true);
      }
    });
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto my-10 w-full max-w-lg">
      <div className="-mx-3 mb-6 flex flex-wrap">
        <div className="w-full px-3">
          <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-700" htmlFor="description">
            Description
          </label>
          <textarea
            className="mb-3 block w-full appearance-none rounded border bg-gray-200 px-4 py-3 leading-tight text-gray-700 focus:bg-white focus:outline-none"
            id="description"
            value={user.description}
            onChange={e => {
              setUser({...user, description: e.target.value});
            }}
          />
        </div>
      </div>

      {user.aboutItems.map((item, index) => (
        <div className="-mx-3 mb-6 flex flex-wrap" key={index}>
          <div className="w-full px-3">
            <label
              className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-700"
              htmlFor={`item-${index}`}>
              {item.label}
            </label>
            <input
              className="block w-full appearance-none rounded border border-gray-200 bg-gray-200 px-4 py-3 leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none"
              type="text"
              id={`item-${index}`}
              defaultValue={item.text}
              onChange={e => {
                const aboutItems = [...user.aboutItems];
                aboutItems[index].text = e.target.value;
                setUser({...user, aboutItems});
              }}
            />
          </div>
        </div>
      ))}
      <button
        type="submit"
        className="focus:shadow-outline rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none">
        Update
      </button>
       
      {saveSuccess && <p className="text-xs italic text-green-500">Data updated successfully!</p>}
      <hr className='my-6'/>

    </form>
  );
};

export default UserForm;
