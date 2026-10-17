import React from 'react';

export interface MandalaBackgroundProps {
  className?: string;
}

/**
 * MandalaBackground renders a subtle, authentic Dong Son / Lotus radial mandala SVG watermark
 * centered behind the transaction checkmark, replicating the signature Vietcombank Digibank texture in bill.JPG.
 */
export const MandalaBackground: React.FC<MandalaBackgroundProps> = ({
  className = 'absolute inset-0 pointer-events-none overflow-hidden',
}) => {
  // Center coordinates relative to the top portion of the canvas (where checkmark badge sits)
  const cx = 207;
  const cy = 135;

  // 24 Radial sunburst rays
  const rays = Array.from({ length: 24 }, (_, i) => {
    const angle = (i * 360) / 24;
    const rad = (angle * Math.PI) / 180;
    const r1 = 44;
    const r2 = 92;
    const x1 = cx + r1 * Math.cos(rad);
    const y1 = cy + r1 * Math.sin(rad);
    const x2 = cx + r2 * Math.cos(rad);
    const y2 = cy + r2 * Math.sin(rad);
    return (
      <line
        key={`ray-${i}`}
        x1={x1.toFixed(1)}
        y1={y1.toFixed(1)}
        x2={x2.toFixed(1)}
        y2={y2.toFixed(1)}
        stroke="#025938"
        strokeWidth="0.8"
        opacity="0.8"
      />
    );
  });

  // 16 Lotus petal outlines
  const petals = Array.from({ length: 16 }, (_, i) => {
    const angle = (i * 360) / 16;
    const rad = (angle * Math.PI) / 180;
    const rTip = 158;
    const rBase = 110;
    const xTip = cx + rTip * Math.cos(rad);
    const yTip = cy + rTip * Math.sin(rad);
    const radLeft = ((angle - 10) * Math.PI) / 180;
    const radRight = ((angle + 10) * Math.PI) / 180;
    const xLeft = cx + rBase * Math.cos(radLeft);
    const yLeft = cy + rBase * Math.sin(radLeft);
    const xRight = cx + rBase * Math.cos(radRight);
    const yRight = cy + rBase * Math.sin(radRight);
    const midRadL = rad - 0.1;
    const midRadR = rad + 0.1;
    const cL_x = cx + 135 * Math.cos(midRadL);
    const cL_y = cy + 135 * Math.sin(midRadL);
    const cR_x = cx + 135 * Math.cos(midRadR);
    const cR_y = cy + 135 * Math.sin(midRadR);

    return (
      <path
        key={`petal-${i}`}
        d={`M ${xLeft.toFixed(1)} ${yLeft.toFixed(1)} Q ${cL_x.toFixed(1)} ${cL_y.toFixed(1)} ${xTip.toFixed(1)} ${yTip.toFixed(1)} Q ${cR_x.toFixed(1)} ${cR_y.toFixed(1)} ${xRight.toFixed(1)} ${yRight.toFixed(1)} Z`}
        fill="none"
        stroke="#025938"
        strokeWidth="0.8"
        opacity="0.85"
      />
    );
  });

  // 32 Dong Son sawtooth / geometric tooth motifs
  const teeth = Array.from({ length: 32 }, (_, i) => {
    const a1 = (i * 360) / 32;
    const a2 = ((i + 0.5) * 360) / 32;
    const a3 = ((i + 1) * 360) / 32;
    const rIn = 216;
    const rOut = 236;
    const r1 = (a1 * Math.PI) / 180;
    const r2 = (a2 * Math.PI) / 180;
    const r3 = (a3 * Math.PI) / 180;
    return (
      <path
        key={`tooth-${i}`}
        d={`M ${(cx + rIn * Math.cos(r1)).toFixed(1)} ${(cy + rIn * Math.sin(r1)).toFixed(1)} L ${(cx + rOut * Math.cos(r2)).toFixed(1)} ${(cy + rOut * Math.sin(r2)).toFixed(1)} L ${(cx + rIn * Math.cos(r3)).toFixed(1)} ${(cy + rIn * Math.sin(r3)).toFixed(1)}`}
        fill="none"
        stroke="#025938"
        strokeWidth="0.75"
        opacity="0.75"
      />
    );
  });

  return (
    <div className={className} data-testid="mandala-background" aria-hidden="true">
      <svg
        viewBox="0 0 414 900"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full object-cover"
        style={{ opacity: 0.075, mixBlendMode: 'multiply' }}
      >
        <g stroke="#025938">
          {/* Inner rings around checkmark */}
          <circle cx={cx} cy={cy} r="44" strokeWidth="1" />
          <circle cx={cx} cy={cy} r="52" strokeWidth="0.6" strokeDasharray="3 3" />
          <circle cx={cx} cy={cy} r="92" strokeWidth="1" />
          <circle cx={cx} cy={cy} r="100" strokeWidth="0.7" strokeDasharray="2 3" />
          <circle cx={cx} cy={cy} r="108" strokeWidth="1.2" />

          {/* Sunburst rays & Lotus petals */}
          {rays}
          {petals}

          {/* Middle ornamental borders */}
          <circle cx={cx} cy={cy} r="168" strokeWidth="1" />
          <circle cx={cx} cy={cy} r="176" strokeWidth="0.6" strokeDasharray="4 4" />
          <circle cx={cx} cy={cy} r="190" strokeWidth="0.8" />
          <circle cx={cx} cy={cy} r="214" strokeWidth="1" />

          {/* Sawtooth / geometric teeth */}
          {teeth}

          {/* Outer expansive mandala circles */}
          <circle cx={cx} cy={cy} r="242" strokeWidth="1.2" />
          <circle cx={cx} cy={cy} r="252" strokeWidth="0.7" strokeDasharray="3 4" />
          <circle cx={cx} cy={cy} r="285" strokeWidth="1" />
          <circle cx={cx} cy={cy} r="325" strokeWidth="0.8" strokeDasharray="5 5" />
          <circle cx={cx} cy={cy} r="370" strokeWidth="1.2" />
          <circle cx={cx} cy={cy} r="425" strokeWidth="0.8" strokeDasharray="6 6" />
          <circle cx={cx} cy={cy} r="485" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
};
