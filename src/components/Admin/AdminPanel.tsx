import {FC, memo} from 'react';
import UserForm from './Forms/AboutForm';
import ProfileForm from './Forms/ProfileForm';
import SocialLinks from './Forms/SocialLinksForm';
import Education from './Forms/EducationForm';
import Experience from './Forms/ExperienceForm';
import SkillsForm from './Forms/SkillsForm';
import TestimonialsForm from './Forms/TestimonialsForm';
import ContactForm from './Forms/ContactForm';
const AdminPanel: FC = memo(() => {
  return (
    <>
      <div className="p-3">
        <h1 className="mt-3 text-center text-white text-xl">Profile Form</h1>
        <ProfileForm />
        <h1 className="mt-3 text-center text-white text-xl">About Form</h1>
        <UserForm />
        <h1 className="mt-3 text-center text-white text-xl">Social Links Form</h1>
        <SocialLinks />
        <h1 className="mt-3 text-center text-white text-xl">Education Form</h1>
        <Education />
        <h1 className="mt-3 text-center text-white text-xl">Work Form</h1>
        <Experience />
        <h1 className="mt-3 text-center text-white text-xl">Skills Form</h1>
        <SkillsForm />
        <h1 className="mt-3 text-center text-white text-xl">Testimonial Form</h1>
        <TestimonialsForm />
        <h1 className="mt-3 text-center text-white text-xl">Contact Form</h1>
        <ContactForm />
      </div>
    </>
  );
});

export default AdminPanel;
