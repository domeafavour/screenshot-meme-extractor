import React, { useRef } from 'react';
import './App.css';
import { UploadButton } from './UploadButton';
import { ImageRowInfo } from './typings';
import {
  clearAndDrawImageFile,
  drawBackdrops,
  getClippedInfo,
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

    drawBackdrops(ctx, {
      x: clippedX,
      y: clippedY,
      width: clippedWidth,
      height: clippedHeight,
    });
  }
}

function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-row justify-center items-center flex-1">
        <canvas ref={canvasRef} />
      </div>
      <div className="flex flex-row gap-4 p-2">
        <UploadButton
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              renderImageFile(file, canvasRef.current!);
            }
            e.target.value = '';
          }}
        />
        <div className="w-1/2">
          <button
            type="button"
            className="text-white bg-blue-600 hover:bg-blue-500 px-2 py-1 rounded-md w-full disabled:bg-gray-300 disabled:cursor-not-allowed"
            disabled
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
