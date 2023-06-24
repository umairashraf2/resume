import {FC, memo} from 'react';

import socialLinksData from '../data/socialLinks.json';

import GithubIcon from '../components/Icon/GithubIcon';
import StackOverflowIcon from '../components/Icon/StackOverflowIcon';
import LinkedInIcon from '../components/Icon/LinkedInIcon';
import InstagramIcon from '../components/Icon/InstagramIcon';
import TwitterIcon from '../components/Icon/TwitterIcon';

const socialLinks = socialLinksData.map(item => {
  let IconComponent;

  switch (item.icon) {
    case 'GithubIcon':
      IconComponent = GithubIcon;
      break;
    case 'StackOverflowIcon':
      IconComponent = StackOverflowIcon;
      break;
    case 'LinkedInIcon':
      IconComponent = LinkedInIcon;
      break;
    case 'InstagramIcon':
      IconComponent = InstagramIcon;
      break;
    case 'TwitterIcon':
      IconComponent = TwitterIcon;
      break;
    default:
      IconComponent = GithubIcon;
  }

  return {
    label: item.label,
    Icon: IconComponent,
    href: item.href,
  };
});

console.log(socialLinks);

const Socials: FC = memo(() => {
  return (
    <>
      {socialLinks.map(({label, Icon, href}) => (
        <a
          aria-label={label}
          className="-m-1.5 rounded-md p-1.5 transition-all duration-300 hover:text-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500  sm:-m-3 sm:p-3"
          href={href}
          key={label}>
          <Icon className="h-5 w-5 align-baseline sm:h-6 sm:w-6" />
        </a>
      ))}
    </>
  );
});

Socials.displayName = 'Socials';
export default Socials;
