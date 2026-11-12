/**
 * Turns a user photo into a canvas-sized data URL. Kept in its own module so
 * the Appearance screen stays about layout, and so the browser-only canvas
 * work never reaches the server bundle.
 */

export const MAX_THEME_IMAGE_BYTES = 20 * 1024 * 1024;
export const MAX_THEME_IMAGE_EDGE = 1600;

function readAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () =>
      typeof reader.result === "string"
        ? resolve(reader.result)
        : reject(new Error("Could not read that image."));
    reader.onerror = () => reject(new Error("Could not read that image."));
    reader.readAsDataURL(file);
  });
}

function loadImage(source: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.decoding = "async";
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("That image could not be opened."));
    image.src = source;
  });
}

/**
 * Resizes the image so the longest edge is 1600 px and re-encodes it as WebP
 * (JPEG where WebP is unavailable). A typical photo lands well under the
 * localStorage budget instead of blowing it with the original file.
 */
export async function themeImageFromFile(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Choose an image file (JPG, PNG, WebP or GIF).");
  }
  if (file.size > MAX_THEME_IMAGE_BYTES) {
    throw new Error("That image is over 20 MB. Choose a smaller file.");
  }

  const source = await readAsDataUrl(file);
  const image = await loadImage(source);

  const width = image.naturalWidth || image.width;
  const height = image.naturalHeight || image.height;
  if (!width || !height) {
    throw new Error("That image has no readable dimensions.");
  }

  const scale = Math.min(1, MAX_THEME_IMAGE_EDGE / Math.max(width, height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(width * scale));
  canvas.height = Math.max(1, Math.round(height * scale));

  const context = canvas.getContext("2d");
  if (!context) throw new Error("The browser could not prepare that image.");

  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";
  context.drawImage(image, 0, 0, canvas.width, canvas.height);

  let output = canvas.toDataURL("image/webp", 0.82);
  if (!output.startsWith("data:image/webp")) {
    output = canvas.toDataURL("image/jpeg", 0.86);
  }
  if (!output.startsWith("data:image/")) {
    throw new Error("Could not process that image.");
  }

  return output;
}
