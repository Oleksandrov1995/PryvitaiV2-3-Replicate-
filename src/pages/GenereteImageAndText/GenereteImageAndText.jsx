import React, { useRef, useState, useEffect } from "react";
import "./GenereteImageAndText.css";
import { 
  GenderAgeSection, 
  PhotoSection,
  GreetingTextSection,
  CardStyleSection, 
  CardMoodSection, 
  TraitsSection,
  GreetingSubjectSection,
  HobbiesSection,
  ImageGenerationSection,
  FixedButtonSection
} from "../../components/sections";
import { useFormData } from "../../utils/formHandlers";
import { ButtonToMain } from "../../components/ButtonToMain/ButtonToMain";

export const GenereteImageAndText = () => {
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
  const greetingTextRef = useRef(null);
  const greetingSubjectRef = useRef(null);
  const traitsRef = useRef(null);
  const imageGenerationRef = useRef(null);

  // Масив refs для зручності навігації
  const sectionRefs = [styleRef, moodRef, photoRef, genderAgeRef, hobbiesRef, greetingSubjectRef, traitsRef, greetingTextRef, imageGenerationRef];

  const { formData, updateField } = useFormData({
    cardStyle: '',
    cardMood: '',
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

  const handleGenerateImage = async () => {
    // Спочатку скролимо до ImageGenerationSection
    if (imageGenerationRef.current) {
      imageGenerationRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest'
      });
      
      // Невелика затримка, щоб скрол встиг завершитися
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    // Потім запускаємо генерацію зображення
    if (generateImageRef.current && generateImageRef.current.generateImage) {
      await generateImageRef.current.generateImage();
    }
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


  // useEffect для відстеження видимості ImageGenerationSection
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target === imageGenerationRef.current) {
            // Коли ImageGenerationSection видима, ховаємо фіксовану кнопку
            setIsFixedButtonVisible(!entry.isIntersecting);
          }
        });
      },
      {
        threshold: 0.1, // Спрацьовує коли 10% секції видимо
      }
    );

    const currentRef = imageGenerationRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);



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
        
      <GenderAgeSection 
        ref={genderAgeRef}
        onGenderChange={handleFieldChange}
        onAgeChange={handleFieldChange}
        scrollToNextSection={createScrollToNextSection(3)}
      />
      
      <HobbiesSection 
        ref={hobbiesRef}
        onHobbyChange={handleFieldChange}
        scrollToNextSection={createScrollToNextSection(4)}
      />
 
      
      <GreetingSubjectSection 
        ref={greetingSubjectRef}
        onSubjectChange={handleFieldChange}
        scrollToNextSection={createScrollToNextSection(5)}
      />
      
      <TraitsSection 
        ref={traitsRef}
        onTraitChange={handleFieldChange}
        scrollToNextSection={createScrollToNextSection(6)}
      />

      <GreetingTextSection 
        ref={greetingTextRef}
        onTextChange={handleFieldChange}
        formData={formData}
        scrollToNextSection={createScrollToNextSection(7)}
      />
      
     
      
      <ImageGenerationSection 
        ref={imageGenerationRef}
        onImageGenerated={handleFieldChange}
        formData={formData}
        onGenerateImageRef={generateImageRef}
        scrollToNextSection={createScrollToNextSection(8)}
      />

      {isFixedButtonVisible && (
        <FixedButtonSection 
          formData={formData}
          onButtonClick={handleGenerateImage}
          loading={generateImageRef.current?.isGenerating || false}
        />
      )}

    </div>
  );
};
