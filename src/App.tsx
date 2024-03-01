import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.css';
import React, { useRef, useState } from 'react';
import './App.css';
import { ResetButton } from './ResetButton';
import { SaveButton } from './SaveButton';
import { SelectButton } from './SelectButton';
import { Area } from './typings';
import {
  clearAndDrawImage,
  createImageElement,
  downloadImage,
  getCanvasImageData,
  getCenterImageArea,
  getClippedImage,
} from './utils';

function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const cropperRef = useRef<Cropper | null>(null);

  const [clippedArea, setClippedArea] = useState<Area | null>(null);

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const canvas = canvasRef.current!;
      const img = await createImageElement(file);
      clearAndDrawImage(img, canvas);
      setImage(img);
      const clipped = getCenterImageArea(getCanvasImageData(canvas));
      setClippedArea(clipped);
      if (cropperRef.current) {
        cropperRef.current.destroy();
      }
      cropperRef.current = new Cropper(canvas, {
        data: clipped,
        rotatable: false,
        responsive: true,
      });
    }
    e.target.value = '';
  }

  function saveClippedImage() {
    const cropperData = cropperRef.current!.getData();
    const fileName = window.prompt('Your meme name', 'meme') ?? 'meme';
    const dataURL = getClippedImage(image!, cropperData!);
    downloadImage(dataURL, `${fileName}.jpg`);
  }

  function resetClippedArea() {
    cropperRef.current?.reset();
    cropperRef.current?.setData(clippedArea!);
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 max-h-full overflow-auto">
        <canvas ref={canvasRef} style={{ display: 'block' }} />
      </div>
      <div className="flex flex-row gap-4 p-2 font-mono">
        <SelectButton onChange={handleChange} />
        {!!clippedArea && (
          <div className="flex flex-row gap-2 w-full">
            <SaveButton onClick={saveClippedImage}>Save</SaveButton>
            <ResetButton onClick={resetClippedArea}>Reset</ResetButton>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
