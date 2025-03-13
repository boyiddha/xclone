import { createImage } from "./imageUtils";

// Core function that crops the image
export default async function getCroppedImg(imageSrc, cropArea) {
  try {
    const image = await createImage(imageSrc); // createImage function => load the image from URL before cropping it
    const canvas = document.createElement("canvas"); // create an HTML <canvas> element to draw the cropped portion
    const ctx = canvas.getContext("2d"); // 2D drawing context

    // set the canvas size to match the cropped area's width and height
    canvas.width = cropArea.width;
    canvas.height = cropArea.height;

    ctx.drawImage(
      image, // the full image
      cropArea.x,
      cropArea.y, // start cropping from (x,y)
      cropArea.width,
      cropArea.height, // crop this area ( cropArea.width , cropArea.height)
      0,
      0, // place the cropped image at (0,0) on the new canvas
      cropArea.width,
      cropArea.height // keep the same size on canvas
    );

    // now conver into Blob
    // canvas.toBlob() converts the cropped image into a blob (binary data).
    //Creates a temporary URL (URL.createObjectURL(blob)) for the cropped image.
    //Returns the new cropped image URL.
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(URL.createObjectURL(blob));
      }, "image/jpeg");
    });
  } catch (error) {
    // return null to indicate failure
    console.error("Cropping error:", error);
    return null;
  }
}
