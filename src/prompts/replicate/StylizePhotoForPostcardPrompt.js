

export const createPromptFluxKontextPro = (formData) => `
Design the image in a ${formData.cardStyle} style,
beautifully redraw people from the photo
draw the ${formData.background} in the background
`;

export const StylizePhotoForPostcardApiSetting = (generatedPrompt, photoUrl ) => ({
  modelId: "black-forest-labs/flux-kontext-pro",
  input: {
    prompt: generatedPrompt, // тепер використовуємо згенерований промпт
    input_image: photoUrl,
    aspect_ratio: "match_input_image",
    // strength: 0.8 // додаткові параметри за потреби
  }
});