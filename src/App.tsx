import React from 'react';
import { ImageRowInfo } from './typings';
import {
  getClippedInfo,
  getImageDataFromFile,
  getImageRowInfos,
} from './utils';

async function renderImageFile(file: File) {
  const { imageData, image } = await getImageDataFromFile(file);
  const infos: ImageRowInfo[] = getImageRowInfos(imageData);

  if (infos.length) {
    const { minX, maxX, minY, maxY } = getClippedInfo(infos);
    const canvas = document.createElement('canvas');
    const imageWidth = maxX - minX + 1;
    const imageHeight = maxY - minY + 1;

    const imageRatio = imageWidth / imageHeight;
    const canvasWidth = window.innerWidth / 2;
    const canvasHeight = canvasWidth / imageRatio;

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    const ctx = canvas.getContext('2d')!;

    ctx.drawImage(
      image,
      minX,
      minY,
      maxX - minX + 1,
      maxY - minY + 1,
      0,
      0,
      canvasWidth,
      canvasHeight
    );

    document.body.appendChild(canvas);
  }
}

function App() {
  return (
    <input
      type="file"
      onChange={(e) => {
        const file = e.target.files?.[0];
        if (file) {
          renderImageFile(file);
        }
        e.target.value = '';
      }}
      accept="image/*"
    />
  );
}

export default App;
