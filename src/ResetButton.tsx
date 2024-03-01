import classNames from 'classnames';
import React from 'react';

export type ResetButtonProps = React.ComponentProps<'button'>;

export function ResetButton({
  className,
  children,
  ...props
}: ResetButtonProps) {
  return (
    <button
      type="button"
      className={classNames(
        'w-1/3 px-2 py-1 rounded-md bg-slate-200 hover:bg-slate-300',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
