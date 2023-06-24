import React, {useState, useEffect} from 'react';

interface EDU {
  date: string;
  location: string;
  title: string;
  content: string;
}

const Education: React.FC = () => {
  const [edu, setEdu] = useState<EDU[]>([]);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  //   console.log(links);

  useEffect(() => {
    fetch('/api/education')
      .then(response => response.json())
      .then(data => setEdu(data));
  }, []);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    fetch('/api/education', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(edu),
    }).then(response => {
      if (response.ok) {
        setSaveSuccess(true);
      }
    });
  };

  if (!edu) {
    return <div>Loading...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto my-10 w-full max-w-lg">
      {edu.map((item, index) => (
        <div className="-mx-3 mb-6 flex flex-wrap" key={index}>
          <div className="w-full px-3">
            <label
              className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-700"
              htmlFor={`item-${index}`}>
              Date
            </label>
            <input
              className="block w-full appearance-none rounded border border-gray-200 bg-gray-200 px-4 py-3 leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none"
              type="text"
              id={`item-${index}`}
              defaultValue={item.date}
              onChange={e => {
                const educ = [...edu];
                educ[index].date = e.target.value;
                setEdu([...educ]);
              }}
            />
            <label
              className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-700"
              htmlFor={`item-${index}`}>
              Location
            </label>
            <input
              className="block w-full appearance-none rounded border border-gray-200 bg-gray-200 px-4 py-3 leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none"
              type="text"
              id={`item-${index}`}
              defaultValue={item.location}
              onChange={e => {
                const educ = [...edu];
                educ[index].location = e.target.value;
                setEdu([...educ]);
              }}
            />
            <label
              className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-700"
              htmlFor={`item-${index}`}>
              Title
            </label>
            <input
              className="block w-full appearance-none rounded border border-gray-200 bg-gray-200 px-4 py-3 leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none"
              type="text"
              id={`item-${index}`}
              defaultValue={item.title}
              onChange={e => {
                const educ = [...edu];
                educ[index].title = e.target.value;
                setEdu([...educ]);
              }}
            />
            <label
              className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-700"
              htmlFor={`item-${index}`}>
              Content
            </label>
            <input
              className="block w-full appearance-none rounded border border-gray-200 bg-gray-200 px-4 py-3 leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none"
              type="text"
              id={`item-${index}`}
              defaultValue={item.content}
              onChange={e => {
                const educ = [...edu];
                educ[index].content = e.target.value;
                setEdu([...educ]);
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

export default Education;
