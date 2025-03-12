import { createImage } from "./imageUtils";

export default async function getCroppedImg(imageSrc, cropArea) {
  try {
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = cropArea.width;
    canvas.height = cropArea.height;

    ctx.drawImage(
      image,
      cropArea.x,
      cropArea.y,
      cropArea.width,
      cropArea.height,
      0,
      0,
      cropArea.width,
      cropArea.height
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(URL.createObjectURL(blob));
      }, "image/jpeg");
    });
  } catch (error) {
    console.error("Cropping error:", error);
    return null;
  }
}
