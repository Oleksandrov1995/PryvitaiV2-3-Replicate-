import React, { useRef, useState, useEffect } from "react";
import "./GenerateFluffyGreeting.css";
import { 
  GenderAgeSection, 
  PhotoSection,

  CardStyleSection, 
  CardMoodSection, 

  GreetingSubjectSection,
  HobbiesSection,
  ImageGenerationSection,
  PersonSection,
  TraitsSection,
  GreetingTextSection,

} from "../../components/sections";
import { useFormData } from "../../utils/formHandlers";
import { ButtonToMain } from "../../components/ButtonToMain/ButtonToMain";
import { useNavigate } from "react-router-dom";
import { StylizePhotoForPostcardApiSetting } from "../../prompts/replicate/StylizePhotoForPostcardPrompt";

export const GenerateFluffyGreeting = () => {
  const navigate = useNavigate();
  const [showGreeting, setShowGreeting] = useState(false);
  // useState для контролю видимості фіксованої кнопки
  const [isFixedButtonVisible, setIsFixedButtonVisible] = useState(true);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [isLandscape, setIsLandscape] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Ref для доступу до функції generateImage з ImageGenerationSection
  const generateImageRef = useRef(null);
  
  // Створюємо refs для кожної секції
  const styleRef = useRef(null);
  const moodRef = useRef(null);
  const photoRef = useRef(null);
  const genderAgeRef = useRef(null);
  const hobbiesRef = useRef(null);

  const greetingSubjectRef = useRef(null);

  const imageGenerationRef = useRef(null);

  // Масив refs для зручності навігації
  const sectionRefs = [styleRef, moodRef, photoRef, genderAgeRef, hobbiesRef, greetingSubjectRef,imageGenerationRef];

  const { formData, updateField } = useFormData({
    cardStyle: '',
    cardMood: '',
    photo: null,
    gender: '',
    age: '',
    hobby: '',

    greetingSubject: '',
 
    generatedImagePrompt: '',
    imageUrl: ''
  });

  const handleFieldChange = (field, value) => {
    updateField(field, value);
  };

  const handleShowGreeting = () => setShowGreeting(true);

  const handleImageGenerated = (url) => {
    updateField('imageUrl', url);
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
      
      <CardMoodSection 
        ref={moodRef}
        onMoodChange={handleFieldChange}
        scrollToNextSection={createScrollToNextSection(1)}
      />
      
      <PhotoSection 
        ref={photoRef}
        onPhotoChange={handleFieldChange}
        scrollToNextSection={createScrollToNextSection(2)}
      />
        
    
      
      <HobbiesSection 
        ref={hobbiesRef}
        onHobbyChange={handleFieldChange}
        scrollToNextSection={createScrollToNextSection(4)}
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
           onImageGenerated={handleImageGenerated}
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
          {/* <PersonSection
            ref={sectionRefs[2]}
            onPersonChange={handleFieldChange}
            scrollToNextSection={createScrollToNextSection(2)}
            selectedGender={formData.gender}
          /> */}
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
            <button onClick={() => {
       // take confirmed text (prefer formData.greetingText) and generated image url
       const text = (formData && formData.greetingText) ? formData.greetingText : "";
       if (!formData.imageUrl) {
         alert("Спочатку згенеруйте зображення.");
         return;
       }
       const params = new URLSearchParams({ imageUrl: formData.imageUrl, text });
       navigate(`/editor?${params.toString()}`);
     }}>Створити листівку</button>
        </div>
      )}
    </div>
  );
};