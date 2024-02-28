import { ClippedInfo, ImageRowInfo, RGBAColor } from './typings';

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

export async function clearAndDrawImageFile(
  file: File,
  canvas: HTMLCanvasElement
): Promise<{
  imageData: ImageData;
  image: HTMLImageElement;
}> {
  const ctx = canvas.getContext('2d')!;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const img = await loadImageFile(file);
  canvas.width = img.width;
  canvas.height = img.height;
  ctx.drawImage(img, 0, 0);
  return {
    imageData: ctx.getImageData(0, 0, img.width, img.height),
    image: img,
  };
}

export function getImageRowInfos(imageData: ImageData) {
  const infos: ImageRowInfo[] = [];

  for (let y = 0; y < imageData.height; y++) {
    let leftX = 0;
    let rightX = imageData.width - 1 - leftX;
    for (let x = leftX; x < Math.ceil(imageData.width / 2); x++) {
      leftX = x;
      rightX = imageData.width - 1 - x;
      if (rightX <= leftX) {
        rightX = leftX + 1;
      }
      if (
        !areColorsEqual(
          getPositionColor(imageData, leftX, y),
          getPositionColor(imageData, rightX, y)
        )
      ) {
        break;
      }
    }
    if (rightX - leftX > 1) {
      infos.push([y, [leftX, rightX]]);
    }
  }
  return infos;
}

export function getMinAndMax(
  pairs: [number, number][]
): [min: number, max: number] {
  let min: number = Infinity;
  let max: number = -Infinity;
  for (let i = 0; i < pairs.length; i++) {
    const [_min, _max] = pairs[i];
    if (_min < min) {
      min = _min;
    }
    if (_max > max) {
      max = _max;
    }
  }
  return [min, max];
}

export function getClippedInfo(infos: ImageRowInfo[]): ClippedInfo {
  const [minX, maxX] = getMinAndMax(infos.map((info) => info[1]));
  const minY = infos[0][0];
  const maxY = infos[infos.length - 1][0];
  return { minX, maxX, minY, maxY };
}
