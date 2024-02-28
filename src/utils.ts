import { RGBAColor } from './typings';

export function areColorsEqual(a: RGBAColor, b: RGBAColor) {
  return (
    a.red === b.red &&
    a.green === b.green &&
    a.blue === b.blue &&
    a.alpha === b.alpha
  );
}

export function getPositionColor(
  imageData: ImageData,
  x: number,
  y: number
): RGBAColor {
  const { width, data } = imageData;
  const index = (x + y * width) * 4;
  return {
    red: data[index],
    green: data[index + 1],
    blue: data[index + 2],
    alpha: data[index + 3],
  };
}

export function loadImageFile(imageFile: File) {
  return new Promise<HTMLImageElement>((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target?.result as string;
      img.onload = () => {
        resolve(img);
      };
    };
    reader.readAsDataURL(imageFile);
  });
}

export async function getImageDataFromFile(
  file: File
): Promise<{
  imageData: ImageData;
  canvas: HTMLCanvasElement;
  image: HTMLImageElement;
}> {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;
  const img = await loadImageFile(file);
  canvas.width = img.width;
  canvas.height = img.height;
  ctx.drawImage(img, 0, 0);
  return {
    imageData: ctx.getImageData(0, 0, img.width, img.height),
    canvas,
    image: img,
  };
}
