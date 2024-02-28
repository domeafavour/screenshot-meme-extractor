import React from 'react';
import { RGBAColor } from './typings';
import { areColorsEqual, getPositionColor, loadImageFile } from './utils';

async function renderImageFile(file: File) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;
  const img = await loadImageFile(file);
  canvas.width = img.width;
  canvas.height = img.height;
  ctx.drawImage(img, 0, 0);

  const sameColorRows: number[] = [];

  // [x, y][]
  const rectPositions: number[][] = [];

  let backgroundColor: RGBAColor | null = null;

  let startX = 0;
  let startY = 0;

  const imageData = ctx.getImageData(0, 0, img.width, img.height);
  const rows: RGBAColor[][] = [];
  for (let y = 0; y < imageData.height; y++) {
    const row: RGBAColor[] = [];
    for (let x = 0; x < imageData.width; x++) {
      row.push(getPositionColor(imageData, x, y));
    }
    rows.push(row);
  }
  console.log('rows', rows);

  for (let y = 0; y < imageData.height; y++) {
    let sameColorCount = 0;
    let previousColor: RGBAColor | null = null;

    for (let x = 0; x < imageData.width; x++) {
      if (x === 0) {
        previousColor = getPositionColor(imageData, x, y);
        sameColorCount = 1;
      } else {
        const currentColor = getPositionColor(imageData, x, y);
        if (areColorsEqual(previousColor!, currentColor)) {
          previousColor = currentColor;
          sameColorCount++;
        }
      }
    }

    if (sameColorCount === imageData.width) {
      if (!backgroundColor) {
        backgroundColor = getPositionColor(imageData, 0, y);
      }
      sameColorRows.push(y);
    }
  }
  console.log('backgroundColor: ', backgroundColor);
  // console.log('rectPositions', rectPositions);
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
