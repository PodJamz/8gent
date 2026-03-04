'use client';

import React from 'react';

interface RalphIconProps {
  className?: string;
  size?: number;
}

export function RalphIcon({ className = '', size = 24 }: RalphIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      width={size}
      height={size}
      className={className}
    >
      {/* Head outline - round shape */}
      <ellipse cx="12" cy="13" rx="9" ry="8.5"/>

      {/* Hair - spiky strands on top */}
      <path d="M7 6 L8 9"/>
      <path d="M9 4.5 L10 8"/>
      <path d="M11 4 L11.5 7.5"/>
      <path d="M13 4 L12.5 7.5"/>
      <path d="M15 4.5 L14 8"/>
      <path d="M17 6 L16 9"/>

      {/* Left eye - big round */}
      <circle cx="8.5" cy="12" r="2.5"/>
      <circle cx="8.5" cy="12" r="0.8" fill="currentColor"/>

      {/* Right eye - big round */}
      <circle cx="15.5" cy="12" r="2.5"/>
      <circle cx="15.5" cy="12" r="0.8" fill="currentColor"/>

      {/* Nose - round bulb */}
      <ellipse cx="12" cy="15" rx="1.8" ry="1.5"/>

      {/* Mouth - simple smile */}
      <path d="M8 18.5 Q12 21 16 18.5"/>

      {/* Ears */}
      <ellipse cx="3.5" cy="13" rx="1" ry="1.5"/>
      <ellipse cx="20.5" cy="13" rx="1" ry="1.5"/>
    </svg>
  );
}

export default RalphIcon;
