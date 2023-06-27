import React, {useState, useEffect} from 'react';

interface Testimonial {
  name: string;
  text: string;
  image: string;
}

const TestimonialsForm: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  useEffect(() => {
    fetch('/api/testimonial')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch social testimonials data');
        }
        return response.json();
      })
      .then(data => setTestimonials(data))
      .catch(err => console.log(err));
  }, []);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    fetch('/api/testimonial', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(testimonials),
    }).then(response => {
      if (response.ok) {
        setSaveSuccess(true);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto my-10 w-full max-w-lg">
      {testimonials.map((testimonial, index) => (
        <div key={index} className="-mx-3 mb-6 flex flex-wrap">
          <div className="mb-2 w-full px-3">
            <label
              className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-700"
              htmlFor={`name-${index}`}>
              Name
            </label>
            <input
              className="block w-full appearance-none rounded border border-gray-200 bg-gray-200 px-4 py-3 leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none"
              type="text"
              id={`name-${index}`}
              value={testimonial.name}
              onChange={e => {
                const newTestimonials = [...testimonials];
                newTestimonials[index].name = e.target.value;
                setTestimonials(newTestimonials);
              }}
            />
          </div>
          <div className="mb-2 w-full px-3">
            <label
              className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-700"
              htmlFor={`text-${index}`}>
              Text
            </label>
            <input
              className="block w-full appearance-none rounded border border-gray-200 bg-gray-200 px-4 py-3 leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none"
              type="text"
              id={`text-${index}`}
              value={testimonial.text}
              onChange={e => {
                const newTestimonials = [...testimonials];
                newTestimonials[index].text = e.target.value;
                setTestimonials(newTestimonials);
              }}
            />
          </div>
          <div className="w-full px-3">
            <label
              className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-700"
              htmlFor={`image-${index}`}>
              Image
            </label>
            <input
              className="block w-full appearance-none rounded border border-gray-200 bg-gray-200 px-4 py-3 leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none"
              type="text"
              id={`image-${index}`}
              value={testimonial.image}
              onChange={e => {
                const newTestimonials = [...testimonials];
                newTestimonials[index].image = e.target.value;
                setTestimonials(newTestimonials);
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
      <hr className="my-6" />
    </form>
  );
};

export default TestimonialsForm;
