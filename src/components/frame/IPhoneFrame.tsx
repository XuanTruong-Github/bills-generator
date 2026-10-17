import React from 'react';

export interface IPhoneFrameProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * iPhone 16 Pro Max Device Frame Container
 *
 * Implements:
 * - 54px outer corner radius matching iPhone 16 Pro Max body
 * - Dark Titanium bezel finish with realistic drop shadow and subtle inner highlight
 * - 44px inner screen corner radius with overflow clipping
 * - Centered Dynamic Island pill cutout at top
 * - Centered floating Home Indicator at bottom
 * - Subtle hardware button accents (Action, Volume rockers, Side/Power button, Camera Control)
 * - Absolutely NO status bar icons (no battery percentage, no wifi arcs, no cellular signal bars, no digital clock)
 */
export const IPhoneFrame: React.FC<IPhoneFrameProps> = ({
  children,
  className = '',
}) => {
  return (
    <div
      data-testid="iphone-frame"
      className={`relative mx-auto bg-[#1c1c1e] p-[10px] sm:p-[12px] rounded-[54px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.45),0_0_0_1px_rgba(255,255,255,0.1)_inset] ${className}`.trim()}
    >
      {/* Subtle Hardware Accents: Left buttons (Action button, Volume Up, Volume Down) */}
      <div
        data-testid="button-action"
        className="absolute -left-[3px] top-[115px] w-[3px] h-[26px] bg-[#3a3a3c] rounded-l-sm pointer-events-none"
        aria-hidden="true"
      />
      <div
        data-testid="button-vol-up"
        className="absolute -left-[3px] top-[160px] w-[3px] h-[50px] bg-[#3a3a3c] rounded-l-sm pointer-events-none"
        aria-hidden="true"
      />
      <div
        data-testid="button-vol-down"
        className="absolute -left-[3px] top-[225px] w-[3px] h-[50px] bg-[#3a3a3c] rounded-l-sm pointer-events-none"
        aria-hidden="true"
      />

      {/* Subtle Hardware Accents: Right buttons (Side/Power button & Camera Control) */}
      <div
        data-testid="button-power"
        className="absolute -right-[3px] top-[170px] w-[3px] h-[75px] bg-[#3a3a3c] rounded-r-sm pointer-events-none"
        aria-hidden="true"
      />
      <div
        data-testid="button-camera"
        className="absolute -right-[2px] top-[480px] w-[2px] h-[60px] bg-[#2c2c2e] rounded-r-sm pointer-events-none"
        aria-hidden="true"
      />

      {/* Inner Screen Container */}
      <div
        data-testid="iphone-screen"
        className="rounded-[44px] overflow-hidden bg-white relative"
      >
        {/* Dynamic Island pill cutout */}
        <div
          data-testid="dynamic-island"
          className="absolute top-0 inset-x-0 w-28 h-7 bg-black rounded-full mx-auto mt-2 z-20 pointer-events-none flex items-center justify-end pr-2.5"
          aria-hidden="true"
        >
          {/* Subtle front camera sensor reflection */}
          <div className="w-2.5 h-2.5 rounded-full bg-[#151516] ring-1 ring-white/10" />
        </div>

        {/* Screen Content */}
        {children}

        {/* Floating Home Indicator */}
        <div
          data-testid="home-indicator"
          className="absolute bottom-0 inset-x-0 w-36 h-1 bg-black/50 rounded-full mx-auto mb-2 pointer-events-none z-20"
          aria-hidden="true"
        />
      </div>
    </div>
  );
};

export default IPhoneFrame;
