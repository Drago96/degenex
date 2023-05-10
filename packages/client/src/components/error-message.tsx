import classnames from 'classnames';
import { ReactNode } from 'react';

type ErrorMessageProps = {
  children: ReactNode;
  className?: string;
};

export default function ErrorMessage({
  children,
  className,
}: ErrorMessageProps) {
  return (
    <div
      className={classnames('text-error', 'dark:text-error-dark', className)}
    >
      {children}
    </div>
  );
}
