import classNames from 'classnames';
import React from 'react';

export type SaveButtonProps = React.ComponentProps<'button'>;

export function SaveButton({ className, children, ...props }: SaveButtonProps) {
  return (
    <button
      type="button"
      className={classNames(
        'text-white bg-blue-600 hover:bg-blue-500 px-2 py-1 rounded-md w-full',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
