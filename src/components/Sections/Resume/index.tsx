import {FC, memo, useEffect, useState} from 'react';

import {  SectionId} from '../../../data/data';
import Section from '../../Layout/Section';
import ResumeSection from './ResumeSection';
import {SkillGroup as SkillGroupComponent} from './Skills';
import TimelineItem from './TimelineItem';

interface Education {
  title: string;
  location: string;
  date: string;
  content: string | JSX.Element;
  // Add other properties for your education items
}

interface Experience {
  title: string;
  location: string;
  date: string;
  content: string | JSX.Element;
  // Add other properties for your experience items
}

interface Skill {
  name: string;
  level: number;
  max?: number;
  // Add other properties for your skill items
}

interface SkillGroup {
  name: string;
  skills: Skill[];
}


const Resume: FC = memo(() => {
  const [education, setEducation] = useState<Education[]>([]);
  const [experience, setExperience] = useState<Experience[]>([]);
  const [skills, setSkills] = useState<SkillGroup[]>([]);

  useEffect(() => {
    fetch('/api/education')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch education data');
        }
        return response.json();
      })
      .then(data => setEducation(data))
      .catch(err => console.log(err));
  }, []);

  useEffect(() => {
    fetch('/api/experience')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch experience data');
        }
        return response.json();
      })
      .then(data => setExperience(data))
      .catch(err => console.log(err));
  }, []);

  useEffect(() => {
    fetch('/api/skills')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch skills data');
        }
        return response.json();
      })
      .then(data => setSkills(data))
      .catch(err => console.log(err));
  }, []);

   return (
    <Section className="bg-neutral-100" sectionId={SectionId.Resume}>
      {/* other components */}
        <ResumeSection title="Education">
          {education.map((item, index) => (
            <TimelineItem item={item} key={`${item.title}-${index}`} />
          ))}
        </ResumeSection>
        <ResumeSection title="Work">
          {experience.map((item, index) => (
            <TimelineItem item={item} key={`${item.title}-${index}`} />
          ))}
        </ResumeSection>
        <ResumeSection title="Skills">
          {/* other components */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {skills.map((skillgroup, index) => (
              <SkillGroupComponent key={`${skillgroup.name}-${index}`} skillGroup={skillgroup} />
            ))}
          </div>
        </ResumeSection>
      {/* other components */}
    </Section>
  );
});

Resume.displayName = 'Resume';
export default Resume;