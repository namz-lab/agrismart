import * as React from 'react';

export const Logo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M12 22c-5.523 0-10-4.477-10-10S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10Z" />
    <path d="M12 12v10" />
    <path d="M16 16c-2-2-3-4-3-6 0-2 1-4 3-6" />
    <path d="M8 16c2-2 3-4 3-6 0-2-1-4-3-6" />
  </svg>
);
