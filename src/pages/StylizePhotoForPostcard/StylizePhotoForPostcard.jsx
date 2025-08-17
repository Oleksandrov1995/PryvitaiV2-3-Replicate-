import React, { useRef } from "react";
import "./StylizePhotoForPostcard.css";
import { 

  PhotoSection,

  CardStyleSection, 

  ImageGenerationSection,
  GreetingSubjectSection,
  GenderAgeSection,
  HobbiesSection,
  TraitsSection,
  GreetingTextSection,
} from "../../components/sections";
import { useFormData } from "../../utils/formHandlers";
import { ButtonToMain } from "../../components/ButtonToMain/ButtonToMain";
import BackgroundsSection from "../../components/sections/BackgroundsSection/BackgroundsSection";
import { StylizePhotoForPostcardApiSetting } from "../../prompts/replicate/StylizePhotoForPostcardPrompt";
import { PersonSection } from "../../components/sections/PersonSection/PersonSection";

export const StylizePhotoForPostcard = () => {
  const [showGreeting, setShowGreeting] = React.useState(false);

  const handleShowGreeting = () => {
    setShowGreeting(true);
    // scroll to greeting block after it becomes visible
    setTimeout(() => {
      const target = sectionRefs[5]?.current; // greetingTextRef index in sectionRefs
      if (target && typeof target.scrollIntoView === 'function') target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  
  // Ref для доступу до функції generateImage з ImageGenerationSection
  const generateImageRef = useRef(null);
  
  // Створюємо refs для кожної секції
  const styleRef = useRef(null);
  const moodRef = useRef(null);
  const backgroundsRef = useRef(null);
  const photoRef = useRef(null);
  const genderAgeRef = useRef(null);
  const hobbiesRef = useRef(null);
  const greetingTextRef = useRef(null);
  const greetingSubjectRef = useRef(null);
  const traitsRef = useRef(null);
  const imageGenerationRef = useRef(null);

  // Масив refs для зручності навігації
  const sectionRefs = [styleRef, moodRef, backgroundsRef, photoRef, genderAgeRef, hobbiesRef, greetingSubjectRef, traitsRef, greetingTextRef, imageGenerationRef];

  const { formData, updateField } = useFormData({
    cardStyle: '',
    cardMood: '',
    background: '',
    photo: null,
    gender: '',
    age: '',
    hobby: '',
    greetingText: '',
    greetingSubject: '',
    trait: '',
    generatedImagePrompt: '',
    imageUrl: ''
  });

  const handleFieldChange = (field, value) => {
    updateField(field, value);

  };


  // Функція для скролу до наступної секції
const createScrollToNextSection = (currentIndex) => {
  return () => {
    const nextIndex = currentIndex + 1;
    const next = sectionRefs[nextIndex]?.current;
    console.log('scroll target', next, typeof next?.scrollIntoView);
    if (next && typeof next.scrollIntoView === 'function') {
      next.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
    } else {
      console.warn('Cannot scroll: target has no scrollIntoView');
    }
  };
};



  return (
    <div className="main-dalle-first-image">
     <div className="form-header">
        <h1>Створи персоналізоване зображення до привітання або жесту разом з Привітайком</h1>
        </div>
        <ButtonToMain />
      <CardStyleSection 
        ref={styleRef}
        onStyleChange={handleFieldChange}
        scrollToNextSection={createScrollToNextSection(0)}
      />
 
      <PhotoSection 
        ref={photoRef}
        onPhotoChange={handleFieldChange}
        scrollToNextSection={createScrollToNextSection(3)}
      />

    
        <BackgroundsSection 
        ref={backgroundsRef}
        onBackgroundChange={handleFieldChange}
        scrollToNextSection={createScrollToNextSection(2)}
      />
      <ImageGenerationSection
        ref={imageGenerationRef}
        onImagePromptChange={handleFieldChange}
        onImageUrlChange={handleFieldChange}
        formData={formData}
        generateImageData={StylizePhotoForPostcardApiSetting(formData)}
        generateImageRef={generateImageRef}
        scrollToNextSection={createScrollToNextSection(9)}
        onShowGreeting={handleShowGreeting}
      />
{showGreeting && (
<div className="greeting-subject-section">
        <GreetingSubjectSection
        ref={sectionRefs[0]}
        onSubjectChange={handleFieldChange}
        scrollToNextSection={createScrollToNextSection(0)}
      />
      <GenderAgeSection
        ref={sectionRefs[1]}
        onGenderChange={handleFieldChange}
        onAgeChange={handleFieldChange}
        scrollToNextSection={createScrollToNextSection(1)}
      />
      <PersonSection
        ref={sectionRefs[2]}
        onPersonChange={handleFieldChange}
        scrollToNextSection={createScrollToNextSection(2)}
        selectedGender={formData.gender}
      />
      <HobbiesSection
        ref={sectionRefs[3]}
        onHobbyChange={handleFieldChange}
        scrollToNextSection={createScrollToNextSection(3)}
      />
      <TraitsSection
        ref={sectionRefs[4]}
        onTraitChange={handleFieldChange}
        scrollToNextSection={createScrollToNextSection(4)}
      />
      
      <GreetingTextSection
        ref={sectionRefs[5]}
        onTextChange={handleFieldChange}
        formData={formData}
        scrollToNextSection={createScrollToNextSection(5)}
      />
</div>
)}
   </div>
  );
};
