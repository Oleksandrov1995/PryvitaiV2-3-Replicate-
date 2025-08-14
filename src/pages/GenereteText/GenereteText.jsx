import React, { useRef, useState, useEffect } from "react";
import "./GenereteText.css";
import { 
  GenderAgeSection, 

  GreetingTextSection,

  TraitsSection,
  GreetingSubjectSection,
  HobbiesSection,

} from "../../components/sections";
import { useFormData } from "../../utils/formHandlers";
import { ButtonToMain } from "../../components/ButtonToMain/ButtonToMain";


export const GenereteText = () => {
  // refs для секцій
  const genderAgeRef = useRef(null);
  const greetingSubjectRef = useRef(null);
  const traitsRef = useRef(null);
  const hobbiesRef = useRef(null);
  const greetingTextRef = useRef(null);
  const sectionRefs = [
    genderAgeRef,
    greetingSubjectRef,
    traitsRef,
    hobbiesRef,
    greetingTextRef
  ];
  const { formData, updateField } = useFormData({   
    gender: '',
    age: '',
    name: '',
    hobby: '',
    greetingText: '',
    greetingSubject: '',
    trait: '',
  });

  // універсальна функція для зміни поля
  const handleFieldChange = (field, value) => updateField(field, value);

  // функція для скролу до наступної секції
  const createScrollToNextSection = (currentIndex) => () => {
    const next = sectionRefs[currentIndex + 1]?.current;
    if (next && typeof next.scrollIntoView === 'function') {
      next.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
    }
  };


  return (
    <div className="main-dalle-first-image">
      <div className="form-header">
        <h1>Створи персоналізоване текстове привітання або жест разом з Привітайком</h1>
      </div>
      <ButtonToMain />
      <GenderAgeSection
        ref={sectionRefs[0]}
        onGenderChange={handleFieldChange}
        onAgeChange={handleFieldChange}
        scrollToNextSection={createScrollToNextSection(0)}
      />
      <GreetingSubjectSection
        ref={sectionRefs[1]}
        onSubjectChange={handleFieldChange}
        scrollToNextSection={createScrollToNextSection(1)}
      />
      <TraitsSection
        ref={sectionRefs[2]}
        onTraitChange={handleFieldChange}
        scrollToNextSection={createScrollToNextSection(2)}
      />
      <HobbiesSection
        ref={sectionRefs[3]}
        onHobbyChange={handleFieldChange}
        scrollToNextSection={createScrollToNextSection(3)}
      />
      <GreetingTextSection
        ref={sectionRefs[4]}
        onTextChange={handleFieldChange}
        formData={formData}
        scrollToNextSection={createScrollToNextSection(4)}
      />
    </div>
  );
};
