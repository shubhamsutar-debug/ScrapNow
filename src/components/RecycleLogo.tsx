import React from 'react';

/**
 * Universal Recycling Symbol — three chasing-arrow segments.
 * Matches the green emoji-style icon provided by the user.
 * Rendered as inline SVG so it can be sized via className/style.
 */
interface RecycleLogoProps {
  className?: string;
  style?: React.CSSProperties;
}

const RecycleLogo: React.FC<RecycleLogoProps> = ({ className, style }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 100"
    className={className}
    style={style}
    aria-label="Recycling symbol"
    role="img"
  >
    {/*
      Three identical arrow-band arms, each rotated 120° apart.
      Each arm: a wide chevron arrowhead at the top tapering into a band
      that sweeps down and around, with a notched inner corner at the tail.
      Left face of each arm is darker for the 3-D bevel in the reference image.
    */}
    <defs>
      {/* Arm shape — points upward, centred horizontally at x=50 */}
      <path
        id="sn-arm"
        d="
          M 50 5
          L 40 5  L 20 43  L 30 43
          L 30 54 L 38 54  L 38 46
          L 62 46 L 62 54  L 70 54
          L 70 43 L 80 43
          L 60 5
          Z
        "
      />
    </defs>

    {/* Arm 1 — top */}
    <use href="#sn-arm" fill="#4CAF50" />
    {/* darker left/shadow face */}
    <path
      d="M 50 5 L 40 5 L 20 43 L 30 43 L 30 54 L 38 54 L 38 46 L 50 46 Z"
      fill="#2E7D32"
      opacity="0.4"
    />

    {/* Arm 2 — lower-right (120°) */}
    <g transform="rotate(120 50 50)">
      <use href="#sn-arm" fill="#4CAF50" />
      <path
        d="M 50 5 L 40 5 L 20 43 L 30 43 L 30 54 L 38 54 L 38 46 L 50 46 Z"
        fill="#2E7D32"
        opacity="0.4"
      />
    </g>

    {/* Arm 3 — lower-left (240°) */}
    <g transform="rotate(240 50 50)">
      <use href="#sn-arm" fill="#4CAF50" />
      <path
        d="M 50 5 L 40 5 L 20 43 L 30 43 L 30 54 L 38 54 L 38 46 L 50 46 Z"
        fill="#2E7D32"
        opacity="0.4"
      />
    </g>
  </svg>
);

export default RecycleLogo;
