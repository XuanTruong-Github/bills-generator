import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BankLogo, NapasLogo, VCBLogoText } from './BankLogos';
import { BANKS_CATALOG, DEFAULT_BANK, getBankById } from '../../data/banks';

describe('Bank Catalog', () => {
  it('has TPBank as the first and default bank with full details', () => {
    expect(DEFAULT_BANK).toEqual(BANKS_CATALOG[0]);
    expect(DEFAULT_BANK.id).toBe('tpbank');
    expect(DEFAULT_BANK.name).toBe('TPBANK');
    expect(DEFAULT_BANK.subName).toBe('Ngân hàng Tiên phong');
    expect(DEFAULT_BANK.shortName).toBe('TPBank');
    expect(DEFAULT_BANK.defaultTransferType).toBe('Chuyển tiền nhanh');
    expect(DEFAULT_BANK.hasNapas).toBe(true);
  });

  it('contains popular Vietnamese banks in catalog', () => {
    const bankIds = BANKS_CATALOG.map((b) => b.id);
    expect(bankIds).toContain('tpbank');
    expect(bankIds).toContain('vietcombank');
    expect(bankIds).toContain('vietinbank');
    expect(bankIds).toContain('bidv');
    expect(bankIds).toContain('techcombank');
    expect(bankIds).toContain('mbbank');
    expect(bankIds).toContain('acb');
    expect(bankIds).toContain('vpbank');
    expect(BANKS_CATALOG.length).toBeGreaterThanOrEqual(8);
  });

  it('ensures all banks have non-empty id, name, and subName with unique ids', () => {
    const ids = new Set<string>();
    for (const bank of BANKS_CATALOG) {
      expect(bank.id).toBeTruthy();
      expect(bank.name).toBeTruthy();
      expect(bank.subName).toBeTruthy();
      expect(ids.has(bank.id)).toBe(false);
      ids.add(bank.id);
    }
  });

  it('retrieves bank by id case-insensitively using getBankById helper', () => {
    const tpbank = getBankById('tpbank');
    expect(tpbank).toBeDefined();
    expect(tpbank?.name).toBe('TPBANK');

    const vcbUpper = getBankById('VIETCOMBANK');
    expect(vcbUpper).toBeDefined();
    expect(vcbUpper?.id).toBe('vietcombank');

    const nonExistent = getBankById('unknown_bank_xyz');
    expect(nonExistent).toBeUndefined();
  });
});

describe('BankLogo component', () => {
  it('renders official TPBank vector SVG with 3-facet gradients', () => {
    const { container } = render(<BankLogo bankId="tpbank" className="w-6 h-6" />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveClass('w-6', 'h-6');

    // Check for gradients
    expect(container.querySelector('#tp-grad1')).toBeInTheDocument();
    expect(container.querySelector('#tp-grad2')).toBeInTheDocument();
    expect(container.querySelector('#tp-grad3')).toBeInTheDocument();

    // Check for colors in gradient stops
    const html = container.innerHTML;
    expect(html).toContain('#fbb413');
    expect(html).toContain('#de5d27');
    expect(html).toContain('#5e2e86');

    // Check for 3 paths with url fills
    expect(container.querySelector('path[fill="url(#tp-grad1)"]')).toBeInTheDocument();
    expect(container.querySelector('path[fill="url(#tp-grad2)"]')).toBeInTheDocument();
    expect(container.querySelector('path[fill="url(#tp-grad3)"]')).toBeInTheDocument();
  });

  it('renders TPBank vector SVG when bankId is uppercase', () => {
    const { container } = render(<BankLogo bankId="TPBANK" />);
    expect(container.querySelector('svg')).toBeInTheDocument();
    expect(container.querySelector('#tp-grad1')).toBeInTheDocument();
  });

  it('renders vector icons for catalog banks', () => {
    const testBanks = ['vietcombank', 'vietinbank', 'bidv', 'techcombank', 'mbbank', 'acb', 'vpbank'];
    for (const id of testBanks) {
      const { container } = render(<BankLogo bankId={id} />);
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    }
  });

  it('renders a fallback bank vector icon for unknown bank id', () => {
    const { container } = render(<BankLogo bankId="unknown-bank" />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });
});

describe('NapasLogo component', () => {
  it('renders "napas" and "247" text with styling', () => {
    render(<NapasLogo className="test-napas" />);
    const napasText = screen.getByText('napas');
    const badge247 = screen.getByText('247');

    expect(napasText).toBeInTheDocument();
    expect(badge247).toBeInTheDocument();

    // Check text container or classes
    const container = napasText.closest('.test-napas');
    expect(container).toBeInTheDocument();
  });
});

describe('VCBLogoText component', () => {
  it('renders "VCB" and "Digibank" header branding text matching bill.JPG', () => {
    render(<VCBLogoText className="test-vcb-header" />);
    const vcbText = screen.getByText('VCB');
    const digibankText = screen.getByText('Digibank');

    expect(vcbText).toBeInTheDocument();
    expect(digibankText).toBeInTheDocument();

    const container = vcbText.closest('.test-vcb-header');
    expect(container).toBeInTheDocument();
  });
});
