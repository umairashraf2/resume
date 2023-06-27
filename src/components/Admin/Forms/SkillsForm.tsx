import React, { useState, useEffect } from 'react';

interface Skill {
  name: string;
  level: number;
}

interface SkillCategory {
  name: string;
  skills: Skill[];
}

const SkillsForm: React.FC = () => {
  const [categories, setCategories] = useState<SkillCategory[]>([]);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

 useEffect(() => {
   fetch('/api/skills')
     .then(response => {
       if (!response.ok) {
         throw new Error('Failed to fetch skills data');
       }
       return response.json();
     })
     .then(data => setCategories(data))
     .catch(err => console.log(err));
 }, []);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    fetch('/api/skills', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(categories),
    }).then(response => {
      if (response.ok) {
        setSaveSuccess(true);
      }
    });
  };

  if (!categories) {
    return <div>Loading...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto my-10 w-full max-w-lg">
      {categories.map((category, index) => (
        <div key={index} className="mb-6 flex flex-col space-y-2">
          <h2 className="text-lg font-semibold">{category.name}</h2>
          {category.skills.map((skill, skillIndex) => (
            <div key={skillIndex} className="flex flex-col space-y-2">
              <label className="text-sm font-semibold">{skill.name}</label>
              <input
                type="number"
                value={skill.level}
                onChange={e => {
                  const newCategories = [...categories];
                  newCategories[index].skills[skillIndex].level = Number(e.target.value);
                  setCategories(newCategories);
                }}
                placeholder="Level"
                className="block w-full appearance-none rounded border border-gray-200 bg-gray-200 px-4 py-3 leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none"
              />
            </div>
          ))}
        </div>
      ))}
      <button
        type="submit"
        className="focus:shadow-outline rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none">
        Update
      </button>
      {saveSuccess && <p className="text-sm text-green-500">Data updated successfully!</p>}
      <hr className="my-6" />
    </form>
  );
};

export default SkillsForm;
