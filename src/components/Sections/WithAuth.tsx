import {useEffect} from 'react';
import {useRouter} from 'next/router';

const withAuth = (WrappedComponent: any) => {
  return ({loggedIn, ...props}: any) => {
    const Router = useRouter();

    useEffect(() => {
      if (!loggedIn) {
        Router.replace('/login');
      }
    }, [loggedIn]);

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
