import React from 'react';
import {
  areColorsEqual,
  getImageDataFromFile,
  getPositionColor,
} from './utils';

async function renderImageFile(file: File) {
  const { imageData, image } = await getImageDataFromFile(file);
  const infos: [number, [number, number]][] = [];

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
        // image
        break;
      }
    }
    if (rightX - leftX > 1) {
      infos.push([y, [leftX, rightX]]);
    }
  }

  if (infos.length) {
    const minX = Math.min(...infos.map(([, [leftX]]) => leftX));
    const maxX = Math.max(...infos.map(([, [, rightX]]) => rightX));
    const minY = infos[0][0];
    const maxY = infos[infos.length - 1][0];
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
