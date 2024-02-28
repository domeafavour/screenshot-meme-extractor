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
    const clippedX = minX;
    const clippedY = minY;
    const clippedWidth = maxX - minX;
    const clippedHeight = maxY - minY;

    const ctx = canvas.getContext('2d')!;
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 1;
    ctx.strokeRect(clippedX, clippedY, clippedWidth, clippedHeight);

    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    // left
    ctx.fillRect(0, 0, clippedX, canvas.height);
    // top center
    ctx.fillRect(
      clippedX + clippedWidth,
      0,
      canvas.width - clippedX - clippedWidth,
      canvas.height
    );
    // right
    ctx.fillRect(clippedX, 0, clippedWidth, clippedY);
    // bottom center
    ctx.fillRect(
      clippedX,
      clippedY + clippedHeight,
      clippedWidth,
      canvas.height - clippedY - clippedHeight
    );
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
