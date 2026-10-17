import React from 'react';
export { BANKS_CATALOG, DEFAULT_BANK, getBankById } from '../../data/banks';

interface BankLogoProps {
  bankId: string;
  className?: string;
}

/**
 * Renders the official TPBank vector SVG logo (3-facet gradient polygon)
 * or vector fallback logos for other catalog banks.
 */
export const BankLogo: React.FC<BankLogoProps> = ({ bankId, className = 'w-5 h-5' }) => {
  const normalizedId = (bankId || '').trim().toLowerCase();

  switch (normalizedId) {
    case 'tpbank':
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 130 115"
          className={className}
          width="24"
          height="24"
          role="img"
          aria-label="TPBank logo"
        >
          <defs>
            <linearGradient id="tp-grad1" x1="0%" y1="0%" x2="100%" y2="50%">
              <stop offset="0%" stopColor="#fbb413" />
              <stop offset="100%" stopColor="#de5d27" />
            </linearGradient>
            <linearGradient id="tp-grad2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#de5d27" />
              <stop offset="100%" stopColor="#5e2e86" />
            </linearGradient>
            <linearGradient id="tp-grad3" x1="0%" y1="100%" x2="50%" y2="0%">
              <stop offset="0%" stopColor="#5e2e86" />
              <stop offset="100%" stopColor="#de5d27" />
            </linearGradient>
          </defs>
          <g>
            {/* Top facet */}
            <path
              fill="url(#tp-grad1)"
              d="m 116.77,0.95 H 11.01 L 108.14,42.72 124.03,15.18 c 1.71,-3.59 1.75,-7.07 0.77,-8.97 -2.64,-5.10 -6.99,-5.28 -8.03,-5.25 z"
            />
            {/* Right / bottom facet */}
            <path
              fill="url(#tp-grad2)"
              d="M 124.30,14.53 39.80,78.55 56.43,107.19 c 0,0 1.91,3.82 7.20,3.82 5.29,0 7.64,-4.40 7.64,-4.40 L 124.03,15.18 c 0.10,-0.21 0.18,-0.43 0.27,-0.65 z"
            />
            {/* Left facet */}
            <path
              fill="url(#tp-grad3)"
              d="M 44.53,15.37 11.01,0.96 c 0,0 -6.90,0 -8.96,5.84 C 0.26,11.89 3.52,16.07 3.52,16.07 l 52.88,91.07 z"
            />
          </g>
        </svg>
      );

    case 'vietcombank':
    case 'vcb':
      return (
        <svg
          viewBox="0 0 100 100"
          className={className}
          role="img"
          aria-label="Vietcombank logo"
        >
          <circle cx="50" cy="50" r="48" fill="#005a36" />
          <path
            d="M50 20 C65 20 78 32 78 48 C78 62 68 74 54 77 C48 78 44 74 44 68 C44 60 52 56 60 52 C65 49 68 45 68 40 C68 32 60 26 50 26 C40 26 32 32 32 40 C32 43 30 45 27 45 C24 45 22 43 22 40 C22 28 35 20 50 20 Z"
            fill="#78be20"
          />
        </svg>
      );

    case 'vietinbank':
    case 'ctg':
      return (
        <svg
          viewBox="0 0 100 100"
          className={className}
          role="img"
          aria-label="VietinBank logo"
        >
          <circle cx="50" cy="50" r="48" fill="#003b70" />
          <path d="M26 34 L74 34 L50 74 Z" fill="#ed1c24" />
          <circle cx="50" cy="48" r="10" fill="#003b70" />
        </svg>
      );

    case 'bidv':
      return (
        <svg
          viewBox="0 0 100 100"
          className={className}
          role="img"
          aria-label="BIDV logo"
        >
          <rect width="100" height="100" rx="20" fill="#006838" />
          <path
            d="M28 22 H52 C66 22 74 30 74 41 C74 48 70 53 63 56 C72 59 76 66 76 74 C76 85 66 91 51 91 H28 V22 Z"
            fill="#fdb813"
          />
          <path
            d="M40 33 V46 H51 C56 46 60 43 60 39 C60 35 56 33 51 33 H40 Z M40 57 V80 H52 C58 80 62 76 62 70 C62 63 58 57 52 57 H40 Z"
            fill="#006838"
          />
        </svg>
      );

    case 'techcombank':
    case 'tcb':
      return (
        <svg
          viewBox="0 0 100 100"
          className={className}
          role="img"
          aria-label="Techcombank logo"
        >
          <rect width="100" height="100" rx="16" fill="#ffffff" stroke="#e31e24" strokeWidth="4" />
          <path d="M24 50 L44 30 L64 50 L44 70 Z" fill="#e31e24" />
          <path d="M48 50 L68 30 L88 50 L68 70 Z" fill="#000000" />
          <path d="M44 42 L52 50 L44 58 L36 50 Z" fill="#ffffff" />
          <path d="M68 42 L76 50 L68 58 L60 50 Z" fill="#ffffff" />
        </svg>
      );

    case 'mbbank':
    case 'mb':
      return (
        <svg
          viewBox="0 0 100 100"
          className={className}
          role="img"
          aria-label="MBBank logo"
        >
          <rect width="100" height="100" rx="18" fill="#002d72" />
          <path
            d="M50 18 L58 38 L80 38 L62 52 L69 74 L50 60 L31 74 L38 52 L20 38 L42 38 Z"
            fill="#e30613"
          />
          <path
            d="M50 27 L55 41 L70 41 L58 50 L62 64 L50 55 L38 64 L42 50 L30 41 L45 41 Z"
            fill="#ffffff"
          />
        </svg>
      );

    case 'acb':
      return (
        <svg
          viewBox="0 0 100 100"
          className={className}
          role="img"
          aria-label="ACB logo"
        >
          <circle cx="50" cy="50" r="48" fill="#005ba4" />
          <text
            x="50"
            y="61"
            textAnchor="middle"
            fill="#ffffff"
            fontSize="34"
            fontWeight="900"
            fontFamily="system-ui, -apple-system, sans-serif"
          >
            ACB
          </text>
        </svg>
      );

    case 'vpbank':
    case 'vpb':
      return (
        <svg
          viewBox="0 0 100 100"
          className={className}
          role="img"
          aria-label="VPBank logo"
        >
          <rect width="100" height="100" rx="18" fill="#ffffff" stroke="#e2e8f0" strokeWidth="2" />
          <path d="M35 70 C35 50 48 35 65 30 C65 50 52 65 35 70 Z" fill="#009944" />
          <path d="M42 75 C55 60 70 52 75 35 C60 48 52 65 42 75 Z" fill="#e60012" />
        </svg>
      );

    default:
      // Generic bank icon fallback
      return (
        <svg
          viewBox="0 0 24 24"
          className={className}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          role="img"
          aria-label="Bank logo"
        >
          <line x1="3" y1="21" x2="21" y2="21" />
          <line x1="3" y1="10" x2="21" y2="10" />
          <polyline points="5 6 12 3 19 6" />
          <line x1="4" y1="10" x2="4" y2="21" />
          <line x1="20" y1="10" x2="20" y2="21" />
          <line x1="8" y1="14" x2="8" y2="17" />
          <line x1="12" y1="14" x2="12" y2="17" />
          <line x1="16" y1="14" x2="16" y2="17" />
        </svg>
      );
  }
};

interface NapasLogoProps {
  className?: string;
}

/**
 * Renders the Napas 247 logo: bold italic "napas" text in light blue (#0284c7 / #0ea5e9),
 * and "247" badge in lime green (#65a30d / #84cc16).
 */
export const NapasLogo: React.FC<NapasLogoProps> = ({ className = '' }) => {
  return (
    <span className={`inline-flex items-baseline tracking-tight ${className}`}>
      <span
        style={{ color: '#0284c7', fontWeight: 800, fontStyle: 'italic' }}
        className="font-extrabold italic text-[#0284c7]"
      >
        napas
      </span>
      <span
        style={{ color: '#84cc16', fontWeight: 800, fontStyle: 'italic', marginLeft: '2px' }}
        className="font-extrabold italic text-[#84cc16] ml-0.5"
      >
        247
      </span>
    </span>
  );
};

export interface VCBLogoTextProps {
  className?: string;
  alt?: string;
}

/**
 * Renders Vietcombank Digibank header branding logo using logo.svg.
 */
export const VCBLogoText: React.FC<VCBLogoTextProps> = ({
  className = '',
  alt = 'VCB Digibank',
}) => {
  return (
    <div className={`inline-flex items-center ${className}`} data-testid="vcb-logo-container">
      <img
        src="/logo.svg"
        alt={alt}
        className="h-7 w-auto object-contain"
        data-testid="vcb-logo"
      />
      <span className="sr-only">VCB</span>
      <span className="sr-only">Digibank</span>
    </div>
  );
};

export const VCBLogo = VCBLogoText;
