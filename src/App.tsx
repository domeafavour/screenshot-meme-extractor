import React, { useRef, useState } from 'react';
import './App.css';
import { SaveButton } from './SaveButton';
import { SelectButton } from './SelectButton';
import { Area } from './typings';
import {
  clearAndDrawImage,
  createImageElement,
  downloadImage,
  drawBackdrops,
  drawClippedArea,
  getCanvasImageData,
  getCenterImageArea,
  getClippedImage,
} from './utils';

function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const [clippedArea, setClippedArea] = useState<Area | null>(null);

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const canvas = canvasRef.current!;
      const img = await createImageElement(file);
      imageRef.current = img;
      clearAndDrawImage(img, canvas);
      const clippedRect = getCenterImageArea(getCanvasImageData(canvas));
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
        {!!clippedArea && (
          <SaveButton
            onClick={() => {
              const dataURL = getClippedImage(imageRef.current!, clippedArea!);
              downloadImage(dataURL, 'clipped.png');
            }}
          >
            Save
          </SaveButton>
        )}
      </div>
    </div>
  );
}

export default App;
