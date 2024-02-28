import React from 'react';
import { ImageRowInfo } from './typings';
import {
  getClippedInfo,
  getImageDataFromFile,
  getImageRowInfos,
} from './utils';

async function renderImageFile(file: File) {
  const { imageData, image, canvas } = await getImageDataFromFile(file);
  const infos: ImageRowInfo[] = getImageRowInfos(imageData);
  document.body.appendChild(canvas);

  if (infos.length) {
    const { minX, maxX, minY, maxY } = getClippedInfo(infos);

    const ctx = canvas.getContext('2d')!;
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 1;
    ctx.strokeRect(
      minX,
      minY,
      ((maxX - minX) / imageData.width) * canvas.width,
      ((maxY - minY) / imageData.height) * canvas.height
    );
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
