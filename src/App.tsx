import React, { useRef } from 'react';
import './App.css';
import { ImageRowInfo } from './typings';
import {
  getClippedInfo,
  clearAndDrawImageFile,
  getImageRowInfos,
} from './utils';

async function renderImageFile(file: File, canvas: HTMLCanvasElement) {
  const { imageData } = await clearAndDrawImageFile(file, canvas);
  const infos: ImageRowInfo[] = getImageRowInfos(imageData);

  if (infos.length) {
    const { minX, maxX, minY, maxY } = getClippedInfo(infos);
    const x = minX;
    const y = minY;
    const width = maxX - minX;
    const height = maxY - minY;

    const ctx = canvas.getContext('2d')!;
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, width, height);
  }
}

function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  return (
    <div>
      <canvas ref={canvasRef} />
      <input
        type="file"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            renderImageFile(file, canvasRef.current!);
          }
          e.target.value = '';
        }}
        accept="image/*"
      />
    </div>
  );
}

export default App;
