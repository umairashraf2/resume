import React, {useState, useEffect} from 'react';

interface ContactItem {
  type: string;
  text: string;
  href: string;
}

interface ContactData {
  headerText: string;
  description: string;
  items: ContactItem[];
}

const ContactForm: React.FC = () => {
  const [contactData, setContactData] = useState<ContactData | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  useEffect(() => {
    fetch('/api/contact')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch contact data');
        }
        return response.json();
      })
      .then(data => setContactData(data))
      .catch(err => console.log(err));
  }, []);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    fetch('/api/contact', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(contactData),
    }).then(response => {
      if (response.ok) {
        setSaveSuccess(true);
      }
    });
  };

  if (!contactData) {
    return <div>Loading...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto my-10 w-full max-w-lg">
      <div className=" flex flex-col space-y-2">
        <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-700" htmlFor="headerText">
          Header Text
        </label>
        <input
          className="block w-full appearance-none rounded border border-gray-200 bg-gray-200 px-4 py-3 leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none"
          type="text"
          id="headerText"
          value={contactData.headerText}
          onChange={e => {
            setContactData({...contactData, headerText: e.target.value});
          }}
        />
        <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-700" htmlFor="headerText">
          Description
        </label>
        <input
          className="block w-full appearance-none rounded border border-gray-200 bg-gray-200 px-4 py-3 leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none"
          type="text"
          id="headerText"
          value={contactData.description}
          onChange={e => {
            setContactData({...contactData, description: e.target.value});
          }}
        />
      </div>

      {/* Iterate over items and generate form inputs */}
      {contactData.items.map((item, index) => (
        <div key={index}>
          <div className=" flex flex-col space-y-2">
            <label
              className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-700"
              htmlFor={`item-type-${index}`}>
              {item.type}
            </label>
            <input
              className="block w-full appearance-none rounded border border-gray-200 bg-gray-200 px-4 py-3 leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none"
              type="text"
              id={`item-type-${index}`}
              value={item.text}
              onChange={e => {
                const newItems = [...contactData.items];
                newItems[index].text = e.target.value;
                setContactData({...contactData, items: newItems});
              }}
            />
          </div>
          <div className="mb-6 flex flex-col space-y-2">
            <label
              className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-700"
              htmlFor={`item-href-${index}`}>
              {item.type} Link
            </label>
            <input
              className="block w-full appearance-none rounded border border-gray-200 bg-gray-200 px-4 py-3 leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none"
              type="text"
              id={`item-href-${index}`}
              value={item.href}
              onChange={e => {
                const newItems = [...contactData.items];
                newItems[index].href = e.target.value;
                setContactData({...contactData, items: newItems});
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

    </form>
  );
};

export default ContactForm;
