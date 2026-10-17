import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { IPhoneFrame } from './IPhoneFrame';

describe('IPhoneFrame Component', () => {
  it('renders children inside the device screen container', () => {
    render(
      <IPhoneFrame>
        <div data-testid="screen-content">VCB Bill Content</div>
      </IPhoneFrame>
    );

    const screenContainer = screen.getByTestId('iphone-screen');
    const content = screen.getByTestId('screen-content');

    expect(content).toBeInTheDocument();
    expect(screen.getByText('VCB Bill Content')).toBeInTheDocument();
    expect(screenContainer).toContainElement(content);
  });

  it('applies titanium border styling and 54px corner radius classes to outer shell', () => {
    render(
      <IPhoneFrame>
        <div>Content</div>
      </IPhoneFrame>
    );

    const frame = screen.getByTestId('iphone-frame');
    expect(frame).toBeInTheDocument();
    expect(frame).toHaveClass('rounded-[54px]');
    expect(frame).toHaveClass('bg-[#1c1c1e]');
    expect(frame).toHaveClass('p-[10px]');
    expect(frame).toHaveClass('sm:p-[12px]');
    expect(frame.className).toContain('shadow-[0_25px_60px_-15px_rgba(0,0,0,0.45),0_0_0_1px_rgba(255,255,255,0.1)_inset]');
  });

  it('configures inner screen container with 44px corner radius and overflow-hidden', () => {
    render(
      <IPhoneFrame>
        <div>Content</div>
      </IPhoneFrame>
    );

    const screenContainer = screen.getByTestId('iphone-screen');
    expect(screenContainer).toHaveClass('rounded-[44px]');
    expect(screenContainer).toHaveClass('overflow-hidden');
    expect(screenContainer).toHaveClass('bg-white');
    expect(screenContainer).toHaveClass('relative');
  });

  it('renders Dynamic Island pill cutout at top with required classes', () => {
    render(
      <IPhoneFrame>
        <div>Content</div>
      </IPhoneFrame>
    );

    const dynamicIsland = screen.getByTestId('dynamic-island');
    expect(dynamicIsland).toBeInTheDocument();
    expect(dynamicIsland).toHaveClass('w-28');
    expect(dynamicIsland).toHaveClass('h-7');
    expect(dynamicIsland).toHaveClass('bg-black');
    expect(dynamicIsland).toHaveClass('rounded-full');
    expect(dynamicIsland).toHaveClass('mx-auto');
    expect(dynamicIsland).toHaveClass('mt-2');
    expect(dynamicIsland).toHaveClass('z-20');
    expect(dynamicIsland).toHaveClass('pointer-events-none');
  });

  it('renders floating home indicator at bottom with required classes', () => {
    render(
      <IPhoneFrame>
        <div>Content</div>
      </IPhoneFrame>
    );

    const homeIndicator = screen.getByTestId('home-indicator');
    expect(homeIndicator).toBeInTheDocument();
    expect(homeIndicator).toHaveClass('w-36');
    expect(homeIndicator).toHaveClass('h-1');
    expect(homeIndicator).toHaveClass('bg-black/50');
    expect(homeIndicator).toHaveClass('rounded-full');
    expect(homeIndicator).toHaveClass('mx-auto');
    expect(homeIndicator).toHaveClass('mb-2');
    expect(homeIndicator).toHaveClass('pointer-events-none');
    expect(homeIndicator).toHaveClass('z-20');
  });

  it('strictly enforces NO status bar elements (no battery, wifi, cellular, or clock)', () => {
    render(
      <IPhoneFrame>
        <div>Content</div>
      </IPhoneFrame>
    );

    expect(screen.queryByTestId('status-bar')).not.toBeInTheDocument();
    expect(screen.queryByTestId('battery-indicator')).not.toBeInTheDocument();
    expect(screen.queryByTestId('wifi-indicator')).not.toBeInTheDocument();
    expect(screen.queryByTestId('cellular-indicator')).not.toBeInTheDocument();
    // Verify no typical status bar clock indicator (e.g., 9:41 or similar)
    expect(screen.queryByText(/^\d{1,2}:\d{2}$/)).not.toBeInTheDocument();
  });

  it('applies custom className to the frame container while preserving base styling', () => {
    render(
      <IPhoneFrame className="custom-preview-wrapper my-custom-class">
        <div>Content</div>
      </IPhoneFrame>
    );

    const frame = screen.getByTestId('iphone-frame');
    expect(frame).toHaveClass('custom-preview-wrapper');
    expect(frame).toHaveClass('my-custom-class');
    expect(frame).toHaveClass('rounded-[54px]');
  });

  it('renders realistic titanium hardware accents including side buttons', () => {
    render(
      <IPhoneFrame>
        <div>Content</div>
      </IPhoneFrame>
    );

    expect(screen.getByTestId('button-action')).toBeInTheDocument();
    expect(screen.getByTestId('button-vol-up')).toBeInTheDocument();
    expect(screen.getByTestId('button-vol-down')).toBeInTheDocument();
    expect(screen.getByTestId('button-power')).toBeInTheDocument();
    expect(screen.getByTestId('button-camera')).toBeInTheDocument();
  });
});

