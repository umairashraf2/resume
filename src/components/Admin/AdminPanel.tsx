import {FC, memo} from 'react';
import UserForm from './Forms/UserForm';
import ProfileForm from './Forms/Profile';
import SocialLinks from './Forms/SocialLinks';
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
      </div>
    </>
  );
});

export default AdminPanel;
