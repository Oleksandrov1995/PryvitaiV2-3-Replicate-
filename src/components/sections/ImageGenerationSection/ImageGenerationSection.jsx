import React, { useState, forwardRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./ImageGenerationSection.css";
import { uploadPhoto } from "../../../config/uploadPhoto";
import { generateImagePrompt } from "../../../config/generateImagePrompt";
import { downloadImage } from "../../../utils/downloadImage";
import { generateImageReplicate } from "../../../config/generateImageReplicate";

import { StylizePhotoForPostcardApiSetting } from "../../../prompts/replicate/StylizePhotoForPostcardPrompt";
import { createPromptFluxKontextPro } from "../../../prompts/replicate/StylizePhotoForPostcardPrompt";

// ДОДАЄМО сюди функцію для збереження в галерею
async function saveImageToGallery(imageUrl) {
  const token = localStorage.getItem("token"); // беремо токен з localStorage
  if (!token) {
    console.warn("❌ Немає токена. Користувач не авторизований.");
    return;
  }

  try {
    const response = await fetch("http://localhost:5000/api/users/gallery", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ imageUrl }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Не вдалося додати зображення.");
    }

    console.log("✅ Зображення додано в галерею:", data.message);
  } catch (err) {
    console.error("❌ Помилка при додаванні в галерею:", err);
  }
}

const ImageGenerationSection = forwardRef(
  (
    {
      onImageGenerated,
      scrollToNextSection,
      formData,
      onGenerateImageRef,
      greetingTextRef,
      generateImageData,
      onShowGreeting,
    },
    ref
  ) => {
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedImageUrl, setGeneratedImageUrl] = useState("");
    const navigate = useNavigate();

    // Функція для переходу до редактора
    const handleEditImage = () => {
      if (!generatedImageUrl) return;

      // If parent provided an onShowGreeting handler, call it to reveal the greeting form
      if (typeof onShowGreeting === "function") {
        onShowGreeting();
        return;
      }

      // Fallback: navigate to editor with query params
      let textToUse = "";
      if (
        greetingTextRef &&
        greetingTextRef.current &&
        greetingTextRef.current.getCurrentText
      ) {
        textToUse = greetingTextRef.current.getCurrentText();
      } else {
        textToUse = formData.greetingText || "";
      }
      const params = new URLSearchParams({
        imageUrl: generatedImageUrl,
        text: textToUse,
      });
      navigate(`/editor?${params.toString()}`);
    };

    const generateImage = useCallback(async () => {
      setIsGenerating(true);

      try {
        console.log("FormData для генерації зображення:", formData);

        // Крок 1: Завантаження фото на Cloudinary (якщо є фото)
        let photoUrl =
          "https://res.cloudinary.com/dnma2ioeb/image/upload/v1754218865/pryvitai-photos/tldl1woyxzaqadwzogx1.jpg"; // заглушка
        if (formData.photo) {
          const convertToBase64 = (file) =>
            new Promise((resolve, reject) => {
              const reader = new FileReader();
              reader.readAsDataURL(file);
              reader.onload = () => resolve(reader.result);
              reader.onerror = (error) => reject(error);
            });

          const photoBase64 = await convertToBase64(formData.photo);
          photoUrl = await uploadPhoto(photoBase64);
        }

        // Крок 2: Генерація промпта
        const generatedImagePrompt = await generateImagePrompt(
          createPromptFluxKontextPro(formData)
        );
        const generateImageData = StylizePhotoForPostcardApiSetting(
          formData,
          generatedImagePrompt.generatedPrompt,
          photoUrl
        );

        console.log("Дані для генерації зображення:", generateImageData);

        if (!generatedImagePrompt)
          throw new Error("Відсутній згенерований промпт");

        // Крок 3: Генерація зображення через Replicate
        const generatedImageUrlFromReplicate = await generateImageReplicate(
          generateImageData
        );

        // Крок 4: Завантаження згенерованого зображення на Cloudinary
        const uploadedGeneratedImageUrl = await uploadPhoto(
          generatedImageUrlFromReplicate
        );
        setGeneratedImageUrl(uploadedGeneratedImageUrl);

        // Крок 5: Збереження в галереї користувача
        await saveImageToGallery(uploadedGeneratedImageUrl);

        if (onImageGenerated) {
          onImageGenerated("finalGeneratedImageUrl", uploadedGeneratedImageUrl);
        }

        // Автоскрол після успішної генерації
        if (scrollToNextSection) setTimeout(() => scrollToNextSection(), 1000);
      } catch (error) {
        console.error("Помилка генерації зображення:", error);
      } finally {
        setIsGenerating(false);
      }
    }, [formData, onImageGenerated, scrollToNextSection]);

    const isFormComplete = () => {
      let completedFields = 0;

      if (formData.cardStyle) completedFields++;
      if (formData.photo) completedFields++;
      if (formData.trait) completedFields++;

      return completedFields >= 2;
    };

    // Передаємо функцію generateImage через ref
    useEffect(() => {
      if (onGenerateImageRef) {
        onGenerateImageRef.current = { generateImage, isGenerating };
      }
    }, [generateImage, isGenerating, onGenerateImageRef]);

    // Функція для скачування зображення
    const handleDownloadImage = async () => {
      if (!generatedImageUrl) return;

      const filename = `pryvitai-${Date.now()}.png`;
      await downloadImage(generatedImageUrl, filename);
    };

    return (
      <section ref={ref} className="image-generation-section">
        <button
          onClick={generateImage}
          disabled={isGenerating || !isFormComplete()}
          className={`generate-image-button ${
            !isFormComplete() ? "disabled" : ""
          }`}
        >
          {isGenerating ? (
            <>
              <span className="loading-spinner"></span>
              Генерую привітайку
            </>
          ) : generatedImageUrl ? (
            "🔄 Генерувати повторно"
          ) : (
            "🎨 Згенерувати зображення"
          )}
        </button>

        {isGenerating && (
          <div className="generation-time-info">
            <p>Генерація займає орієнтовно 2-3 хвилини</p>
          </div>
        )}

        {generatedImageUrl && (
          <div className="final-image-result">
            <p>
              <strong>🖼️ Фінальне згенероване зображення:</strong>
            </p>

            <div className="image-preview">
              <img
                src={generatedImageUrl}
                alt="Згенероване зображення"
                className="preview-image"
              />
            </div>
            <p>🌟 Фінальне зображення успішно згенеровано!</p>

            <button onClick={handleDownloadImage} className="download-button">
              💾 Зберегти привітайку
            </button>

            <button className="edit-button" onClick={handleEditImage}>
              ✏️ Додати текст привітання
            </button>
          </div>
        )}
      </section>
    );
  }
);

export default ImageGenerationSection;
