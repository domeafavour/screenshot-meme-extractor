import { Area, RGBAColor } from './typings';

export function areColorsEqual(a: RGBAColor, b: RGBAColor) {
  return (
    a.red === b.red &&
    a.green === b.green &&
    a.blue === b.blue &&
    a.alpha === b.alpha
  );
}

export function areColorsRoughlyEqual(a: RGBAColor, b: RGBAColor, diff = 10) {
  return (
    Math.abs(a.red - b.red) < diff &&
    Math.abs(a.green - b.green) < diff &&
    Math.abs(a.blue - b.blue) < diff &&
    Math.abs(a.alpha - b.alpha) < diff
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

export function createImageElement(imageFile: File) {
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

export function getCanvasImageData(canvas: HTMLCanvasElement): ImageData {
  const ctx = canvas.getContext('2d')!;
  return ctx.getImageData(0, 0, canvas.width, canvas.height);
}

export function clearAndDrawImage(
  img: HTMLImageElement,
  canvas: HTMLCanvasElement
) {
  const ctx = canvas.getContext('2d')!;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  canvas.width = img.width;
  canvas.height = img.height;
  ctx.drawImage(img, 0, 0);
}

export function isRowColorsRoughlyEqual(
  imageData: ImageData,
  row: number
): [boolean, number, number] {
  for (let left = 0; left < imageData.width; left++) {
    const right = imageData.width - 1 - left;
    if (
      !areColorsRoughlyEqual(
        getPositionColor(imageData, left, row),
        getPositionColor(imageData, right, row)
      )
    ) {
      return [false, left, right];
    }
  }
  return [true, 0, imageData.width - 1];
}

export function getCenterImageArea(imageData: ImageData): Area {
  const { width, height } = imageData;

  const halfHeight = Math.ceil(height / 2);

  let top = 0;
  let bottom = height - 1;

  let left = Infinity;
  let right = -Infinity;

  for (let i = halfHeight; i >= 0; i--) {
    const [isUpRowRoughlyEqual, leftX, rightX] = isRowColorsRoughlyEqual(
      imageData,
      i
    );
    if (isUpRowRoughlyEqual) {
      top = i + 1;
      break;
    } else {
      left = Math.min(left, leftX);
      right = Math.max(right, rightX);
    }
  }

  for (let i = top + 1; i < height; i++) {
    const [isDownRowRoughlyEqual, leftX, rightX] = isRowColorsRoughlyEqual(
      imageData,
      i
    );
    if (isDownRowRoughlyEqual) {
      bottom = i - 1;
      break;
    } else {
      left = Math.min(left, leftX);
      right = Math.max(right, rightX);
    }
  }

  left = isFinite(left) ? left : 0;
  right = isFinite(right) ? right : width - 1;

  return { x: left, y: top, width: right - left, height: bottom - top };
}

export function drawBackdrops(
  canvas: HTMLCanvasElement,
  options: Partial<
    Area & {
      color: string;
    }
  >
) {
  const ctx = canvas.getContext('2d')!;
  const canvasWidth = canvas.width;
  const canvasHeight = canvas.height;
  const {
    x = 0,
    y = 0,
    width = canvasWidth,
    height = canvasHeight,
    color = 'rgba(0, 0, 0, 0.5)',
  } = options;
  ctx.fillStyle = color;
  // left
  ctx.fillRect(0, 0, x, canvasHeight);
  // top center
  ctx.fillRect(x + width, 0, canvasWidth - x - width, canvasHeight);
  // right
  ctx.fillRect(x, 0, width, y);
  // bottom center
  ctx.fillRect(x, y + height, width, canvasHeight - y - height);
}

export function drawClippedArea(
  canvas: HTMLCanvasElement,
  options: Partial<
    Area & {
      color: string;
    }
  >
) {
  const {
    x = 0,
    y = 0,
    width = canvas.width,
    height = canvas.height,
    color = 'red',
  } = options;
  const ctx = canvas.getContext('2d')!;
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  ctx.strokeRect(x, y, width, height);
}

export function getClippedImage(img: HTMLImageElement, clippedArea: Area) {
  const canvas = document.createElement('canvas');
  canvas.width = clippedArea.width;
  canvas.height = clippedArea.height;
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(
    img,
    clippedArea.x,
    clippedArea.y,
    clippedArea.width,
    clippedArea.height,
    0,
    0,
    clippedArea.width,
    clippedArea.height
  );
  return canvas.toDataURL();
}

export function downloadImage(dataUrl: string, filename: string) {
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = filename;
  a.click();
}
