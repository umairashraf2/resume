import {ChevronDownIcon} from '@heroicons/react/24/outline';
import classNames from 'classnames';
import Image from 'next/image';
import {FC, memo, useState, useEffect} from 'react';

import {SectionId} from '../../data/data';
import Section from '../Layout/Section';
import Socials from '../Socials';
import { initializeApp } from 'firebase/app';
import { getStorage, ref, getDownloadURL } from "firebase/storage";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyCx4C2G_h2jXoFjKpBoveNbt1SEByX6aUc',
  authDomain: 'daniel-we.firebaseapp.com',
  projectId: 'daniel-we',
  storageBucket: 'daniel-we.appspot.com',
  messagingSenderId: '771178122800',
  appId: '1:771178122800:web:3402520bb668280bf0e7f5',
  measurementId: 'G-DECDJLFQ7X',
};


// Initialize Firebase
initializeApp(firebaseConfig);

type Paragraph = {
  text: string;
  strong: {
    text: string;
    className: string;
  };
  text2: string;
  strong2: {
    text: string;
    className: string;
  };
  text3: string;
};

type Action = {
  href: string;
  text: string;
  primary: boolean;
};

type HeroData = {
  imageSrc: string;
  name: string;
  description: {
    paragraphs: Paragraph[];
  };
  actions: Action[];
};




const Hero: FC = memo(() => {
    // Declare state variables for the fetched data and the loading state
  // Declare state variables for the fetched data and the loading state
  const [heroDatas, setHeroDatas] = useState<HeroData | null>(null);
  const [isLoading, setIsLoading] = useState(true);  // New loading state

  const [fileUrl,setFileUrl] = useState('')  

  const downloadFile = async () => {
    const storage = getStorage();
    const fileRef = ref(storage, 'Resume.pdf');
    const url = await getDownloadURL(fileRef);
    setFileUrl(url)
  };

  useEffect(()=>{
    downloadFile();
  },[downloadFile])

  // Fetch data from the API when component mounts
  useEffect(() => {
    setIsLoading(true);  // Set loading state to true at the start of the request

    fetch('/api/profile')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch social testimonials data');
        }
        return response.json();
      })
      .then((data: HeroData) => {  // Type annotation added here
        setHeroDatas(data);
        setIsLoading(false);  // Set loading state to false once the data is fetched
      })
      .catch(err => {
        console.error('Error fetching profile:', err);
        setIsLoading(false);  // Set loading state to false if there is an error
      });
  }, []);


  // Check if data is being loaded
  if (isLoading) {
    return <div>Loading...</div>;
  }

  const {
    name,
    description: {paragraphs},
    actions,
  } = heroDatas!;  // The "!" means we're asserting that heroDatas is not null



  return (
    <Section noPadding sectionId={SectionId.Hero}>
      <div className="relative flex h-screen w-full items-center justify-center">
        <Image
          alt={`${name}-image`}
          className="absolute z-0 h-full w-full object-cover"
          // placeholder="blur"
          priority
          src="/images/header-background.webp"
          // objectFit="cover"
          fill
        />
        <div className="z-10  max-w-screen-lg px-4 lg:px-0">
          <div className="flex flex-col items-center gap-y-6 rounded-xl bg-gray-800/40 p-6 text-center shadow-lg backdrop-blur-sm">
            <h1 className="text-4xl font-bold text-white sm:text-5xl lg:text-7xl">{name}</h1>

            {paragraphs.map(paragraph => {
              const {text, strong, text2, strong2, text3} = paragraph;
              return (
                <p className="prose-sm text-stone-200 sm:prose-base lg:prose-lg">
                  {text}
                  <strong className={strong.className}>{strong.text}</strong>
                  {text2}
                  <strong className={strong2.className}>{strong2.text}</strong>
                  {text3}
                </p>
              );
            })}

            <div className="flex gap-x-4 text-neutral-100">
              <Socials />
            </div>
            <div className="flex w-full justify-center gap-x-4">
              {actions.map(({href, text, primary}) => (
                <a
                  className={classNames(
                    'flex gap-x-2 rounded-full border-2 bg-none px-4 py-2 text-sm font-medium text-white ring-offset-gray-700/80 hover:bg-gray-700/80 focus:outline-none focus:ring-2 focus:ring-offset-2 sm:text-base',
                    primary ? 'border-orange-500 ring-orange-500' : 'border-white ring-white',
                  )}
                  href={primary ? fileUrl : href}
                  key={text}>
                  {text}
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-6 flex justify-center">
          <a
            className="rounded-full bg-white p-1 ring-white ring-offset-2 ring-offset-gray-700/80 focus:outline-none focus:ring-2 sm:p-2"
            href={`/#${SectionId.About}`}>
            <ChevronDownIcon className="h-5 w-5 bg-transparent sm:h-6 sm:w-6" />
          </a>
        </div>
      </div>
    </Section>
  );
});

Hero.displayName = 'Hero';
export default Hero;
