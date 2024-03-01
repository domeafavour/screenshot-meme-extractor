import React, { useRef } from 'react';

export type UploadButtonProps = {
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
};

export function SelectButton({ onChange }: UploadButtonProps) {
  const uploadRef = useRef<HTMLInputElement | null>(null);
  return (
    <div className="cursor-pointer w-1/2 overflow-hidden relative">
      <input
        ref={uploadRef}
        className="hidden"
        type="file"
        onChange={onChange}
        accept="image/*"
      />
      <div className="absolute top-0 left-0 w-full">
        <button
          type="button"
          className="text-white bg-green-600 hover:bg-green-500 px-2 py-1 rounded-md w-full"
          onClick={() => {
            uploadRef.current?.click();
          }}
        >
          Select...
        </button>
      </div>
    </div>
  );
}
