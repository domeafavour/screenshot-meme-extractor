import React, { useRef, useState } from 'react';
import './App.css';
import { SelectButton } from './SelectButton';
import { Area } from './typings';
import {
  clearAndDrawImage,
  downloadImage,
  drawBackdrops,
  drawClippedArea,
  getCenterImageArea,
  getClippedImage,
  loadImageFile,
} from './utils';

function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const [clippedArea, setClippedArea] = useState<Area | null>(null);

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const canvas = canvasRef.current!;
      const img = await loadImageFile(file);
      imageRef.current = img;
      const imageData = await clearAndDrawImage(img, canvas);
      const clippedRect = getCenterImageArea(imageData);
      setClippedArea(clippedRect);

      if (clippedRect) {
        const {
          x: clippedX,
          y: clippedY,
          width: clippedWidth,
          height: clippedHeight,
        } = clippedRect;

        drawClippedArea(canvas, {
          x: clippedX,
          y: clippedY,
          width: clippedWidth,
          height: clippedHeight,
        });

        drawBackdrops(canvas, {
          x: clippedX,
          y: clippedY,
          width: clippedWidth,
          height: clippedHeight,
        });
      }
    }
    e.target.value = '';
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-row justify-center items-center flex-1">
        <canvas ref={canvasRef} />
      </div>
      <div className="flex flex-row gap-4 p-2 font-mono">
        <SelectButton onChange={handleChange} />
        <div className="w-1/2">
          <button
            type="button"
            className="text-white bg-blue-600 hover:bg-blue-500 px-2 py-1 rounded-md w-full disabled:bg-gray-300 disabled:cursor-not-allowed"
            disabled={!clippedArea}
            onClick={() => {
              const dataURL = getClippedImage(imageRef.current!, clippedArea!);
              downloadImage(dataURL, 'clipped.png');
            }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
