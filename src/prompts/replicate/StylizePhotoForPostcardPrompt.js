

export const StylizePhotoForPostcardApiSetting = (formData) => ({
  modelId: "black-forest-labs/flux-kontext-pro",
  prompt: `Design the image in a ${formData.cardStyle} style,
beautifully redraw people from the photo
draw the ${formData.background} in the background`,
aspect_ratio: "match_input_image",
    // strength: 0.8 // можна додати додаткові параметри за потреби
  
});
