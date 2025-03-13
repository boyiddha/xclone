// Loads an image from a URL
// create an Image object to load the image from a URL

// Return a promise
//✅ If the image loads successfully, resolve(image).
//❌ If it fails, reject(error).
//This function is essential because we need to load the image before cropping it.

export const createImage = (url) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.src = url;
    image.onload = () => resolve(image);
    image.onerror = (error) => reject(error);
  });

// convert image file into base64 string
export const fileToBase64 = async (file) => {
  try {
    const buffer = await file.arrayBuffer(); // Read file as buffer
    const base64String = Buffer.from(buffer).toString("base64");
    const fileType = file.type.split("/")[1]; // Extract file extension
    return `data:image/${fileType};base64,${base64String}`;
  } catch (error) {
    console.error("Error converting file to base64:", error);
    throw new Error("File conversion failed");
  }
};

// convert image url to base64 string

export const fileURLToBase64 = async (url) => {
  return fetch(url)
    .then((res) => res.blob()) // Convert URL to Blob
    .then((blob) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob); // Convert Blob to Base64
      });
    });
};
