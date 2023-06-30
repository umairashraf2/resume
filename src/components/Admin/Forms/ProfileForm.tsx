import React, {useState, useEffect} from 'react';

interface StrongText {
  text: string;
  className: string;
}

interface DescriptionParagraph {
  text: string;
  strong: StrongText;
  text2: string;
  strong2: StrongText;
  text3: string;
}

interface Description {
  paragraphs: DescriptionParagraph[];
}

interface Profile {
  imageSrc: string;
  name: string;
  description: Description;
  actions: any[];
}

const ProfileForm: React.FC = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  useEffect(() => {
    fetch('/api/profile')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch profile data');
        }
        return response.json();
      })
      .then(data => setProfile(data))
      .catch(err => console.log(err));
  }, []);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    fetch('/api/profile', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(profile),
    }).then(response => {
      if (response.ok) {
        setSaveSuccess(true);
      }
    });
  };

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="mx-auto my-10 w-full max-w-lg">
        <div className="-mx-3 mb-6 flex flex-wrap">
          <div className="w-full px-3">
            <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-700" htmlFor="name">
              Name
            </label>
            <input
              className="mb-3 block w-full appearance-none rounded border border-gray-200 bg-gray-200 px-4 py-3 leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none"
              id="name"
              type="text"
              value={profile.name}
              onChange={e => {
                setProfile({...profile, name: e.target.value});
              }}
            />
          </div>
        </div>

        {profile.description.paragraphs.map((paragraph, index) => (
          <div className="-mx-3 mb-6 flex flex-wrap" key={index}>
            <div className="w-full px-3">
              <label
                className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-700"
                htmlFor={`paragraph-${index}`}>
                Paragraph {index + 1} Text
              </label>
              <input
                className="mb-3 block w-full appearance-none rounded border border-gray-200 bg-gray-200 px-4 py-3 leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none"
                id={`paragraph-${index}`}
                type="text"
                value={paragraph.text}
                onChange={e => {
                  const newParagraphs = [...profile.description.paragraphs];
                  newParagraphs[index].text = e.target.value;
                  setProfile({
                    ...profile,
                    description: {paragraphs: newParagraphs},
                  });
                }}
              />
              <label
                className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-700"
                htmlFor={`strong-${index}`}>
                Paragraph {index + 1} Bold Text
              </label>
              <input
                className="mb-3 block w-full appearance-none rounded border border-gray-200 bg-gray-200 px-4 py-3 leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none"
                id={`strong-${index}`}
                type="text"
                value={paragraph.strong.text}
                onChange={e => {
                  const newParagraphs = [...profile.description.paragraphs];
                  newParagraphs[index].strong.text = e.target.value;
                  setProfile({
                    ...profile,
                    description: {paragraphs: newParagraphs},
                  });
                }}
              />
              {/* similar input fields for text2, strong2.text, and text3 */}
              <label
                className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-700"
                htmlFor={`paragraph-${index}`}>
                Paragraph {index + 1} Text 2
              </label>
              <input
                className="mb-3 block w-full appearance-none rounded border border-gray-200 bg-gray-200 px-4 py-3 leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none"
                id={`paragraph-${index}`}
                type="text"
                value={paragraph.text2}
                onChange={e => {
                  const newParagraphs = [...profile.description.paragraphs];
                  newParagraphs[index].text2 = e.target.value;
                  setProfile({
                    ...profile,
                    description: {paragraphs: newParagraphs},
                  });
                }}
              />
              <label
                className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-700"
                htmlFor={`strong-${index}`}>
                Paragraph {index + 1} Bold 2 Text
              </label>
              <input
                className="mb-3 block w-full appearance-none rounded border border-gray-200 bg-gray-200 px-4 py-3 leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none"
                id={`strong-${index}`}
                type="text"
                value={paragraph.strong2.text}
                onChange={e => {
                  const newParagraphs = [...profile.description.paragraphs];
                  newParagraphs[index].strong2.text = e.target.value;
                  setProfile({
                    ...profile,
                    description: {paragraphs: newParagraphs},
                  });
                }}
              />
              <label
                className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-700"
                htmlFor={`paragraph-${index}`}>
                Paragraph {index + 1} Text 3
              </label>
              <input
                className="mb-3 block w-full appearance-none rounded border border-gray-200 bg-gray-200 px-4 py-3 leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none"
                id={`paragraph-${index}`}
                type="text"
                value={paragraph.text3}
                onChange={e => {
                  const newParagraphs = [...profile.description.paragraphs];
                  newParagraphs[index].text3 = e.target.value;
                  setProfile({
                    ...profile,
                    description: {paragraphs: newParagraphs},
                  });
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
    </>
  );
};

export default ProfileForm;
