import React, {useState, useEffect} from 'react';

interface Link {
  label: string;
  icon: string;
  href: string;
}

const SocialLinks: React.FC = () => {
  const [links, setLinks] = useState<Link[]>([]);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  console.log(links);

  useEffect(() => {
    fetch('/api/links')
      .then(response => response.json())
      .then(data => setLinks(data));
  }, []);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    fetch('/api/links', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(links),
    }).then(response => {
      if (response.ok) {
        setSaveSuccess(true);
      }
    });
  };

  if (!links) {
    return <div>Loading...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto my-10 w-full max-w-lg">
      {links.map((item, index) => (
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
              defaultValue={item.href}
              onChange={e => {
                const link = [...links];
                link[index].href = e.target.value;
                setLinks([...link]);
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

      {saveSuccess && <p className="text-xs italic text-green-500">Data saved successfully!</p>}
    </form>
  );
};

export default SocialLinks;
