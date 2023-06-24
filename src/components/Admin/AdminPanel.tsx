import {FC, memo} from 'react';
import UserForm from './Forms/AboutForm';
import ProfileForm from './Forms/ProfileForm';
import SocialLinks from './Forms/SocialLinksForm';
import Education from './Forms/EducationForm';
import Experience from './Forms/ExperienceForm';
const AdminPanel: FC = memo(() => {
  return (
    <>
      <div>
        <h1 className="mt-3 text-center text-white">Profile Form</h1>
        <ProfileForm />
        <hr className="mx-auto my-4 w-1/3 border-t-2 border-gray-300" />
        <h1 className="mt-3 text-center text-white">About Form</h1>
        <UserForm />
        <hr className="mx-auto my-4 w-1/3 border-t-2 border-gray-300" />
        <h1 className="mt-3 text-center text-white">Social Links Form</h1>
        <SocialLinks />
        <hr className="mx-auto my-4 w-1/3 border-t-2 border-gray-300" />
        <h1 className="mt-3 text-center text-white">Education Form</h1>
        <Education/>
        <hr className="mx-auto my-4 w-1/3 border-t-2 border-gray-300" />
        <h1 className="mt-3 text-center text-white">Work Form</h1>
        <Experience/>
      </div>
    </>
  );
});

export default AdminPanel;
