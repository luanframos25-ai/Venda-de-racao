import React from 'react';

export const BrandLogoMark: React.FC<{ className?: string }> = ({
  className = 'w-8 h-8',
}) => (
  <svg
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <rect width="40" height="40" rx="12" fill="#30483A" />
    <path
      d="M11 16L13.5 10.5L17.5 14C18.3 13.8 19.1 13.7 20 13.7C20.9 13.7 21.7 13.8 22.5 14L26.5 10.5L29 16C30.2 17.6 30.8 19.6 30.5 21.8C29.9 26.2 25.6 29.2 20 29.2C14.4 29.2 10.1 26.2 9.5 21.8C9.2 19.6 9.8 17.6 11 16Z"
      fill="#F7F4ED"
    />
    <circle cx="16.5" cy="20.5" r="1.4" fill="#30483A" />
    <circle cx="23.5" cy="20.5" r="1.4" fill="#30483A" />
    <path
      d="M18.5 23.2L20 24.4L21.5 23.2"
      stroke="#F4AD73"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const PawPrintSvg: React.FC<{
  className?: string;
  color?: string;
}> = ({ className = 'w-6 h-6', color = 'currentColor' }) => (
  <svg
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <ellipse cx="9" cy="12" rx="2.4" ry="3.2" transform="rotate(-15 9 12)" fill={color} />
    <ellipse cx="14.2" cy="8.5" rx="2.2" ry="3.1" transform="rotate(-4 14.2 8.5)" fill={color} />
    <ellipse cx="19.8" cy="9.2" rx="2.2" ry="3.1" transform="rotate(8 19.8 9.2)" fill={color} />
    <ellipse cx="24" cy="13.5" rx="2.3" ry="3" transform="rotate(22 24 13.5)" fill={color} />
    <path
      d="M16 15.2C19.6 15.2 22.8 18.2 22.5 21.8C22.2 24.3 20 25.4 18.2 24.8C17.1 24.4 15.3 24.4 14.2 24.8C12.2 25.5 9.8 24.2 9.5 21.6C9.2 18.1 12.4 15.2 16 15.2Z"
      fill={color}
    />
  </svg>
);

export const MascotCatSvg: React.FC<{ className?: string }> = ({
  className = 'w-14 h-14',
}) => (
  <svg
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <circle cx="32" cy="34" r="24" fill="#F7F4ED" stroke="#30483A" strokeWidth="2.2" />
    <path
      d="M16 24L19 10L29 18C30.9 17.6 33.1 17.6 35 18L45 10L48 24C50.4 27.2 51.4 31.2 50.8 35.4C49.7 43.2 42.1 48.8 32 48.8C21.9 48.8 14.3 43.2 13.2 35.4C12.6 31.2 13.6 27.2 16 24Z"
      fill="#A8BFA3"
      stroke="#30483A"
      strokeWidth="2.2"
      strokeLinejoin="round"
    />
    <path d="M20.5 22L22 15L27 19.5" fill="#F4AD73" />
    <path d="M43.5 22L42 15L37 19.5" fill="#F4AD73" />
    <circle cx="25.5" cy="32.5" r="2.5" fill="#30483A" />
    <circle cx="38.5" cy="32.5" r="2.5" fill="#30483A" />
    <circle cx="26.2" cy="31.7" r="0.8" fill="#FFFFFF" />
    <circle cx="39.2" cy="31.7" r="0.8" fill="#FFFFFF" />
    <path
      d="M30.2 36.2L32 37.8L33.8 36.2"
      fill="#F4AD73"
      stroke="#30483A"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M27.5 39.8C29 41.2 31 41.2 32 39.6C33 41.2 35 41.2 36.5 39.8"
      stroke="#30483A"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    <path d="M11 33H19" stroke="#30483A" strokeWidth="1.6" strokeLinecap="round" />
    <path d="M11.5 36.5H19" stroke="#30483A" strokeWidth="1.6" strokeLinecap="round" />
    <path d="M45 33H53" stroke="#30483A" strokeWidth="1.6" strokeLinecap="round" />
    <path d="M45 36.5H52.5" stroke="#30483A" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

export const QuizCatIllustration: React.FC<{ step: number; className?: string }> = ({
  step,
  className = 'w-20 h-20',
}) => {
  const accent = step % 2 === 0 ? '#A8BFA3' : '#F4AD73';
  return (
    <svg
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <circle cx="40" cy="40" r="36" fill={accent} fillOpacity="0.22" />
      <path
        d="M22 33L25 18L36 27C38.6 26.5 41.4 26.5 44 27L55 18L58 33C60.2 36.4 61 40.6 60.2 44.8C58.8 53 50.6 58.5 40 58.5C29.4 58.5 21.2 53 19.8 44.8C19 40.6 19.8 36.4 22 33Z"
        fill="#FFFFFF"
        stroke="#30483A"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <circle cx="33" cy="40" r="2.4" fill="#30483A" />
      <circle cx="47" cy="40" r="2.4" fill="#30483A" />
      <path
        d="M38 44.5L40 46.2L42 44.5"
        stroke="#F4AD73"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M35.5 48.5C37 50 38.8 50 40 48.2C41.2 50 43 50 44.5 48.5"
        stroke="#30483A"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
};
